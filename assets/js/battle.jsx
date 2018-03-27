import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function play_game(root, channel){
  ReactDOM.render(<Battle channel={channel} />, root);
}

class Battle extends React.Component {

  constructor(props){
    super(props);
    this.channel = props.channel;
    this.userName = props.channel.params.userName;
    this.state = {
      player1: "",
      player2: "",
      poke1: [],
      poke2: [],
      attacker: "",
      game_over: false,
      dialogue: "",
      winner: "",
    };
    this.interval;
    this.effect = "low";
    this.currAtk = null;
    this.atkClicked = false;
    this.skillVal = 25;
    this.dialogueSet = false;
    this.soundPlaying = true;

    this.channel.join()
      .receive("ok", this.gotView.bind(this))
      .receive("error", resp => {console.log("Unable to join", resp) });

    this.channel.on("state_update", game => {
      this.channel.push("update_state", game)
        .receive("ok", this.gotView.bind(this))
    });

    this.channel.on("restart_game", game => {
      this.channel.push("reset_game", game)
        .receive("ok", this.gotView.bind(this))
    });
  }

  componentDidMount(){
    $('.mover').css("-webkit-animation-play-state", "paused");
    var _ = this;
    $(document).keypress(function(e) {
      if(_.currAtk != null && _.atkClicked != false){
        console.log("KEY PRESSED")
        if (e.charCode == 32){
          //spacebar pressed
          _.handleToggle();
        }
      }
    });

    $(window).on("beforeunload", function() {
      _.channel.push("leave", this.userName)
        .receive("ok", );
    });

    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'https://www.televisiontunes.com/uploads/audio/Pokemon%20-%20Instrumental.mp3');

      audioElement.addEventListener('ended', function() {
        console.log("player ended")
        this.play();
      }, false);

      audioElement.play();
      audioElement.volume = 0.15;

      $("#sound").click(function(){
        if (_.soundPlaying == true){
          audioElement.pause();
          _.soundPlaying = false;
        } else {
          audioElement.play();
          _.soundPlaying = true;
        }
        console.log(_.soundPlaying)
      });

  }


  //gets view from the server and sets the state of the ga  me
  gotView(view){
    this.setState(view.game);
  }

  restart() {
    setTimeout(
      () => this.channel.push("restart").receive("ok", this.gotView.bind(this)),
      1000
    );
  }

  clickAtk(atkBtn){
    if (this.state.player2 != "") {
    if(this.state.game_over == false){
    if(this.state.attacker == this.userName && this.atkClicked == false){
      if (atkBtn.spl == true){
        if (this.state.attacker == this.state.player1) {
          if (this.state.poke1.energy == 100){
            this.atkHandler(atkBtn);
          } else {
            alert("Special Abilities can only be used when ENERGY is 100!");
          }
        } else {
          if (this.state.poke2.energy == 100){
            this.atkHandler(atkBtn);
          } else {
            alert("Special Abilities can only be used when ENERGY is 100!");
          }
        }
      } else {
        this.atkHandler(atkBtn);
        }
      }
    }
  }
  }

  atkHandler(atkBtn){
    this.currAtk = atkBtn;
    this.atkClicked = true;
    this.handleToggle();
  }

  pushAtk(){
    console.log("attacked!")
    var atk = {dmg: this.currAtk.dmg, name: this.currAtk.name, spl: this.currAtk.spl, effect: this.effect, dialogue: this.state.dialogue}
    this.channel.push("attack", atk)
        .receive("ok", this.gotView.bind(this));
    this.currAtk = null;

    setTimeout(function(){
      console.log("stopped")
      $('.mover').css("webkitAnimation", "none");
    }, 1000);

    setTimeout(function(){
      console.log("strted anim and paused")
      $('.mover').css("webkitAnimation", '');
      $('.mover').css("-webkit-animation-play-state", "paused");
    }, 1005);

    this.skillVal = 25;
    this.atkClicked = false;
  }

  handleToggle(){
    var style = $('.mover').css("-webkit-animation-play-state");
    console.log(style)
    if(style == "paused") {
      this.skillScoreCounter();
      $('.mover').css("-webkit-animation-play-state", "running");
    } else {
      clearInterval(this.interval);
      $('.mover').css("-webkit-animation-play-state", "paused");
      this.pushAtk();
    }
  }

  skillScoreCounter(){
    var i = this.skillVal; //1/20th of animation-duration.
    var val = 25; //1/20th of animation-duration.
    var called = false;
    this.interval = setInterval(increment, val);
    // var pcTxt = document.getElementById("pc-dmg");
    // var pcDmgTxt = document.getElementById("pc-dmg-txt");
    var here = this;
    function increment(){
      // pcTxt.innerHTML = i;
      if (i == val * 20){
        i = val;
        // pcDmgTxt.innerHTML = "WEAK";
        here.effect = "low";
      } else {
        if (i == (val * 5) || i == (val * 6) || i == (val * 7) || i == (val * 8)
      || i == (val * 13) || i == (val * 14) || i == (val * 15) || i == (val * 16)){
          // pcDmgTxt.innerHTML = "MEDIUM";
          here.effect = "med";
        } else if (i == (val * 9) || i == (val * 10) || i == (val * 11) || i == (val * 12)){
          // pcDmgTxt.innerHTML = "CRITICAL";
          here.effect = "high";
        } else if (i == val || i == (val * 2) || i == (val * 3) || i == (val * 4) || i == (val * 17) || i == (val * 18) || i == (val * 19) || i == (val * 20)){
          // pcDmgTxt.innerHTML = "WEAK";
          here.effect = "low";
        }
        i = i + val;
        here.skillVal = i;
      }
    }
  }



  render(){

    let sound_div = <div></div>;
      console.log(this.soundPlaying)
    if (this.soundPlaying == true){
      sound_div =  <div id="sound"><img src="/images/sound-on.png" id="sound-img"/></div>;
    } else {
      sound_div =  <div id="sound"><img src="/images/sound-off.png" id="sound-img"/></div>;
    }


    if (this.state.dialogue == ""){
      this.state.dialogue = "Waiting for " + this.state.attacker + " to attack";
    }

    let pokeball_p1 = <div></div>;
    let pokeball_p2 = <div></div>;

    if (this.state.attacker == this.state.player1){
      pokeball_p1 =   <div className="col" id="poke-turn">
                        <img src="/images/pokeball.png" width="85%" id="pokeball1"/>
                      </div>;
    } else {
      pokeball_p2 =   <div className="col" id="poke-turn">
                        <img src="/images/pokeball.png" width="85%" id="pokeball2"/>
                      </div>;
    }


    let win_popup = <div></div>;
    let lose_popup = <div></div>;
    let obs_popup = <div></div>;
    if (this.state.game_over == true){
      let win_play = "";
      if (this.state.winner == this.state.player1){
        win_play = this.state.player1;
      } else {
        win_play = this.state.player2;
      }

      if (this.userName == this.state.player1 || this.userName == this.state.player2){
        if (this.state.winner == this.userName){
          win_popup = <Popup title="Victory!" victor={this.userName} restart={this.restart.bind(this)} />;
        } else {
          lose_popup = <Popup title="Defeat!" victor={win_play} restart={this.restart.bind(this)} />;
        }
      } else {
        obs_popup = <Popup title="Game Over!" victor={win_play} />;
      }
    }

    let empty_div = <div></div>;

    let attack_list = empty_div;
    if (this.userName == this.state.player1){
        attack_list = _.map(this.state.poke1.attacks, (atk, ii) => {
          return <AttackButton atk={atk} player="player1" clickAtk={this.clickAtk.bind(this)} key={ii} />;
        });
    }

    if (this.userName == this.state.player2){
        attack_list = _.map(this.state.poke2.attacks, (atk, ii) => {
          return <AttackButton atk={atk} player="player2" clickAtk={this.clickAtk.bind(this)} key={ii} />;
        });
    }

    let attack_div = <div></div>;
    if (attack_list != empty_div) {
      attack_div = <div className="atk-container">{attack_list}</div>;
    }
    let p2_div = <div className="col">Waiting for Player 2 to Connect</div>;
    if (this.state.player2 != ""){
      p2_div = <div className="col">
        <div className="row">
          <div className="col-2">
            <p>Health</p>
          </div>
          <div className="col-9">
            <div className="progress">
              <div className="progress-bar bg-success" role="progressbar" aria-valuenow={this.state.poke2.hp} aria-valuemin="0" aria-valuemax="100" id="p2hp">
                {this.state.poke2.hp}
              </div>
              </div>
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <p>Energy</p>
          </div>
          <div className="col-9">
            <div className="progress">
              <div className="progress-bar bg-warning" role="progressbar" aria-valuenow={this.state.poke2.energy} aria-valuemin="0" aria-valuemax="100" id="p2en">
                {this.state.poke2.energy}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
                <p>Trainer <b>{this.state.player2}</b> has chosen <b><i>{this.state.poke2.name}</i></b><br/>
                  [Type: <b>{this.state.poke2.type}</b>. Weakness: <b>{this.state.poke2.weakness}</b>]</p>
          </div>
        </div>
        <div className="row">
          <div className="col-10">
            <img src={this.state.poke2.image} height="250px" className="poke-img" id="poke2img"/>
          </div>
            <div className="col">
              {pokeball_p2}
            </div>
        </div>
      </div>;
    } else {
      this.state.dialogue = "Waiting for Player 2 to Connect";
    }
    $('#p1hp').css("width", this.state.poke1.hp+"%");
    $('#p2hp').css("width", this.state.poke2.hp+"%");
    $('#p1en').css("width", this.state.poke1.energy+"%");
    $('#p2en').css("width", this.state.poke2.energy+"%");

    return (
    <div className="container" id="battleground">
      {win_popup}{lose_popup}{obs_popup}
      {sound_div}
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col-2">
              <p>Health</p>
            </div>
            <div className="col-9">
              <div className="progress">
                  <div className="progress-bar bg-success" role="progressbar" aria-valuenow={this.state.poke1.hp} aria-valuemin="0" aria-valuemax="100" id="p1hp">
                    {this.state.poke1.hp}
                  </div>
                </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              <p>Energy</p>
            </div>
            <div className="col-9">
              <div className="progress">
                <div className="progress-bar bg-warning" role="progressbar" aria-valuenow={this.state.poke1.energy} aria-valuemin="0" aria-valuemax="100" id="p1en">
                  {this.state.poke1.energy}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="row">
                <div className="col-8">
                  <p>Trainer <b>{this.state.player1}</b> has chosen <b><i>{this.state.poke1.name}</i></b><br/>
                    [Type: <b>{this.state.poke1.type}</b>. Weakness: <b>{this.state.poke1.weakness}</b>]</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              {pokeball_p1}
            </div>
            <div className="col-10">
              <img src={this.state.poke1.image} height="250px" className="poke-img" id="poke1img"/>
            </div>
          </div>
        </div>
        {p2_div}
    </div>
    <div className="row" id="attack-row">
      <div className="col-4">
          {attack_div}
      </div>
      <div className="col-8">
        <div className="row">
          <div className="col">
            <div className="row" id="skilltags">
              <div className="col-2">
                <p id="left">LOW</p>
              </div>
              <div className="col-3">
                <p>MEDIUM</p>
              </div>
              <div className="col-2">
                <p id="middle">HIGH</p>
              </div>
              <div className="col-3">
                <p>MEDIUM</p>
              </div>
              <div className="col-2">
                <p id="right">LOW</p>
              </div>
            </div>
            <div className="skill-bar">
            <div className="mover"></div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="talk-bubble">
              <p id="dialog">{this.state.dialogue}</p>
            </div>
            </div>
        </div>
      </div>
    </div>
  </div>
    );
  }
}

//this function generates a function when player wins the game
// it displays score as well as option to play again
function Popup(props){
  let title=props.title;
  let victor = props.victor;
  let btn = <div></div>;
  if (title != "Game Over!"){
    btn = <Button className="play-again" onClick={() => props.restart()}>Play Again?</Button>;
  }
  let msg = victor + " has won this Battle!";
  if (victor == ""){
    msg = "Player left game!";
  }

  return(
      <div className="popup">
        <div className="popup-content">
          <h1>{title}</h1>
          <h3>{msg}</h3>
          {btn}
        </div>
      </div>
    )
}



//returns the element for tile
function AttackButton(props) {

  let atk = props.atk;
  let player = props.player;
  var name = atk.name;
  var dmg = atk.dmg;
  var spl = atk.spl;

  let style;

  //decide the className and text to show depending on whether tile has been matched
  if(spl == true){
    style = "btn btn-warning atk"
  } else {
    style = "btn btn-info atk"
  }

  return <Button className={style} val={name} dmg={dmg} spl={spl.toString()} player={player} onClick={() => props.clickAtk(atk)}>{name}</Button>;

}
