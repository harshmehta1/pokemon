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
    this.state = {player1: "", player2: "", poke1: [], poke2: [], observers: [], players_turn: ""};

    this.channel.join()
      .receive("ok", this.gotView.bind(this))
      .receive("error", resp => {console.log("Unable to join", resp) });

    this.channel.on("user:joined", game => {
      this.channel.push("update_state", game)
        .receive("ok", this.gotView.bind(this))
    });
    // this.channel.push("player_joined", this.state)
    //     .receive("ok", this.gotView.bind(this));
  }

  //gets view from the server and sets the state of the game
  gotView(view){
    this.setState(view.game);
  }

  clickAtk(atkBtn){

  }

  render(){

    let attack_list = <div></div>;
    if (this.userName == this.state.player1){
        attack_list = _.map(this.state.poke1.attacks, (atk, ii) => {
          if (atk.spl){
            return <Button className="btn btn-warning" val={atk.name} dmg={atk.dmg} spl={atk.spl.toString()} onClick={this.clickAtk.bind(this)} p="p1" key={ii} >{atk.name}</Button>;
          } else {
            return <Button className="btn btn-info" val={atk.name} dmg={atk.dmg} spl={atk.spl.toString()} onClick={this.clickAtk.bind(this)} p="p1" key={ii} >{atk.name}</Button>;
          }
        });
        console.log(attack_list);
    }

    if (this.userName == this.state.player2){
        attack_list = _.map(this.state.poke2.attacks, (atk, ii) => {
          if (atk.spl){
            return <Button className="btn btn-warning" val={atk.name} dmg={atk.dmg} spl={atk.spl.toString()} onClick={this.clickAtk.bind(this)} p="p1" key={ii} >{atk.name}</Button>;
          } else {
            return <Button className="btn btn-info" val={atk.name} dmg={atk.dmg} spl={atk.spl.toString()} onClick={this.clickAtk.bind(this)} p="p1" key={ii} >{atk.name}</Button>;
          }
        });
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
        <div className="atk-container">
          {attack_list}
        </div>
      </div>
      <div className="col">
        <div className="talk-bubble">
          <p id="dialog">Waiting for player 1 to attack</p>
        </div>
      </div>
    </div>
    </div>
    );
  }

}
