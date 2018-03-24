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
      ready_to_fire: false
    };

    this.channel.join()
      .receive("ok", this.gotView.bind(this))
      .receive("error", resp => {console.log("Unable to join", resp) });

    this.channel.on("state_update", game => {
      this.channel.push("update_state", game)
        .receive("ok", this.gotView.bind(this))
    });
  }

  //gets view from the server and sets the state of the ga  me
  gotView(view){
    this.setState(view.game);
  }

  clickAtk(atkBtn){
    if(this.state.attacker == this.userName){
      this.channel.push("attack", atkBtn)
          .receive("ok", this.gotView.bind(this));
    }
  }




  render(){

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
      <div className="col">
        <div className="talk-bubble">
          <p id="dialog">Waiting for {this.state.attacker} to select attack</p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col">
        <button id="toggle" value='play'>Play</button>
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

$(document).ready(function() {
  $("#toggle").click(function() {
    alert("HEY!");
    // var mv = $('.mover');
    // if($("#toggleButton").html() == "Play")
    // {
    //   $(this).html('Pause');
    //   mv.addClass('tran');
    // } else {
    //   $("#toggleButton").html('Play');
    //   var computedStyle = $boxTwo.css('margin-left');
    //   mv.removeClass('tran');
    //   mv.css('margin-left', computedStyle);
    // }
  });

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
