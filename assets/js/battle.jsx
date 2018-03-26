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
      ready_to_fire: false,
      game_over: false,
    };
    this.interval;
    this.effect = "low";
    this.currAtk = null;
    this.atkClicked = false;
    this.skillVal = 25;

    this.channel.join()
      .receive("ok", this.gotView.bind(this))
      .receive("error", resp => {console.log("Unable to join", resp) });

    this.channel.on("state_update", game => {
      this.channel.push("update_state", game)
        .receive("ok", this.gotView.bind(this))
    });
  }

  componentDidMount(){
    $('.mover').css("-webkit-animation-play-state", "paused");
    var _ = this;
    $(document).keypress(function(e) {
      if(_.currAtk != null && _.atkClicked != false){
        if (e.keyCode == 32){
          //spacebar pressed
          _.handleToggle();
        }
      }
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
    if(this.state.attacker == this.userName && this.atkClicked == false){
      this.currAtk = atkBtn;
      this.atkClicked = true;
      this.handleToggle();
    }
  }

  pushAtk(){
    console.log("attacked!")
    var atk = {dmg: this.currAtk.dmg, name: this.currAtk.name, spl: this.currAtk.spl, effect: this.effect}
    this.channel.push("attack", atk)
        .receive("ok", this.gotView.bind(this));

    this.currAtk = null;
    setTimeout(function(){
      $('.mover').css("webkitAnimation", "none");
    }, 1000);

    setTimeout(function(){
      $('.mover').css("webkitAnimation", '');
      $('.mover').css("-webkit-animation-play-state", "paused");
    }, 2000);
    // $('.mover').css("-webkit-animation-play-state", "paused");
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
    var pcTxt = document.getElementById("pc-dmg");
    var pcDmgTxt = document.getElementById("pc-dmg-txt");
    var here = this;
    function increment(){
      pcTxt.innerHTML = i;
      if (i == val * 20){
        i = val;
        pcDmgTxt.innerHTML = "Low Effect";
        here.effect = "low";
      } else {
        if (i == (val * 5) || i == (val * 6) || i == (val * 7) || i == (val * 8)
      || i == (val * 13) || i == (val * 14) || i == (val * 15) || i == (val * 16)){
          pcDmgTxt.innerHTML = "Med Effect";
          here.effect = "med";
        } else if (i == (val * 9) || i == (val * 10) || i == (val * 11) || i == (val * 12)){
          pcDmgTxt.innerHTML = "High Effect";
          here.effect = "high";
        } else if (i == val || i == (val * 2) || i == (val * 3) || i == (val * 4) || i == (val * 17) || i == (val * 18) || i == (val * 19) || i == (val * 20)){
          pcDmgTxt.innerHTML = "Low Effect";
          here.effect = "low";
        }
        i = i + val;
        here.skillVal = i;
      }
    }
  }


  render(){
    let winner = null;
    if (this.state.poke2.hp < this.state.poke1.hp) {
      winner = this.state.player1;
    }

    if (this.state.game_over == true) {
    // Attribution to: https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_ref_js_modal_show_hide&stacked=h
      return (
        <div class="gameOver" tabindex="-1" id="gameOver" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title">Game over!</h2>
              </div>
              <div class="modal-body">
                <p>{winner} wins the game</p>
              </div>
              <div class="modal-footer">
                <Button type="button" class="btn btn-secondary" onClick={this.restart.bind(this)}>Play Again</Button>
              </div>
            </div>
          </div>
        </div>);
    }

    let skill_button = null;
    let empty_div = <div></div>;
    if (this.userName == this.state.attacker && this.state.ready_to_fire == true) {
      skill_button = <Button id="stop">Fire! </Button>;
    }

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
            <div className="progress-bar bg-success" role="progressbar" aria-valuenow={this.state.poke2.hp} aria-valuemin="0" aria-valuemax="100" id="p2hp">
              {this.state.poke2.hp}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <p>Energy</p>
          </div>
          <div className="col-9">
            <div className="progress-bar bg-warning" role="progressbar" aria-valuenow={this.state.poke2.energy} aria-valuemin="0" aria-valuemax="100" id="p2en">
              {this.state.poke2.energy}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>Trainer {this.state.player2} has chosen {this.state.poke2.name}</p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <img src={this.state.poke2.image} height="300px" className="poke-img"/>
          </div>
        </div>
      </div>;
    }


    return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col-2">
              <p>Health</p>
            </div>
            <div className="col-9">
              <div className="progress-bar bg-success" role="progressbar" aria-valuenow={this.state.poke1.hp} aria-valuemin="0" aria-valuemax="100" id="p1hp">
                {this.state.poke1.hp}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              <p>Energy</p>
            </div>
            <div className="col-9">
              <div className="progress-bar bg-warning" role="progressbar" aria-valuenow={this.state.poke1.energy} aria-valuemin="0" aria-valuemax="100" id="p1en">
                {this.state.poke1.energy}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p>Trainer {this.state.player1} has chosen {this.state.poke1.name}</p>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <img src={this.state.poke1.image} height="300px" className="poke-img"/>
            </div>
          </div>
        </div>
        {p2_div}
    </div>
    <div className="row">
      <div className="col-4">
          {attack_div}
      </div>
      <div className="col-8">
        <div className="row h-50">
          <div className="col-12 h-50">
             <div id="pc-dmg"></div><div id="pc-dmg-txt"></div>
            <div className="skill-bar"><div className="mover"></div></div>
          </div>
        </div>
        <div className="row h-50">
          <div className="col-12">
            <div className="talk-bubble">
              <p id="dialog">Waiting for {this.state.attacker} to select attack</p>
            </div>
            </div>
        </div>
      </div>
    </div>
  </div>
    );
  }
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
    style = "btn btn-warning"
  } else {
    style = "btn btn-info"
  }

  return <Button className={style} val={name} dmg={dmg} spl={spl.toString()} player={player} onClick={() => props.clickAtk(atk)}>{name}</Button>;

}


  // $(document).ready(function() {
  //   var counter = 0,
  //   progressbar = setInterval(function()
  //   {
  //       $('#progressbar .progress-text').text("Attack was " + counter + '% effective');
  //       $('#progressbar .progress').css({'width':counter+'%'});
  //       if (counter == 101) {
  //           clearInterval(progressbar);
  //           alert('Something went wrong!');
  //       } else
  //           counter = (++counter % 101)
  //
  //   }, 1);
  //
  //   $('#stop').click(function() {
  //   clearInterval(progressbar);
  //   });
  // });
