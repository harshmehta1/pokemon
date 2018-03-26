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
    window.onKeyPress(this.keyHandler);


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
    if(this.state.attacker == this.userName){
      this.handleToggle();
      this.channel.push("attack", atkBtn)
          .receive("ok", this.gotView.bind(this));
    }
  }


  handleToggle(){
    // var mv = $('.mover');
    // if($("#toggle").html() == "Play")
    // {
    //   $("#toggle").html('Pause');
    //   mv.addClass('tran');
    // } else {
    //   $("#toggle").html('Play');
    //   var computedStyle = mv.css('margin-left');
    //   mv.removeClass('tran');
    //   mv.css('margin-left', computedStyle);
    // }
    // var mv = document.getElementById('mover');
    // var style = mv.style;
    var style = $('.mover').css("-webkit-animation-play-state");
    if(style == "paused") {
      $('.mover').css("-webkit-animation-play-state", "running");
    } else {
      $('.mover').css("-webkit-animation-play-state", "paused");
    }
    // setTimeout(function() {
    //   mv.css("-webkit-animation-play-state", "paused");
    // }, 1000);
    // if (style.webkitAnimationPlayState === 'running') {
    //   clearInterval(interval);
    //   style.webkitAnimationPlayState = 'paused';
    // } else {
    //   style.webkitAnimationPlayState = 'running';
    // }
  }

  keyHandler(e){
    // if (e == 'Enter'){
      alert("ENTER!");
    // }
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
    <div className="container" onKeyPress={this.keyHandler}>
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
      <div className="col">
        <div className="talk-bubble">
          <p id="dialog">Waiting for {this.state.attacker} to select attack</p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col">
        <button id="toggle" onClick={this.handleToggle.bind(this)} value='play'>Play</button>
         <div id="pc-dmg"></div><div id="pc-dmg-txt"></div>
        <div className="skill-bar"><div className="mover"></div></div>
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

$(document).keypress(function() {
  this.handleToggle();
});
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
