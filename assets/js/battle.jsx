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
  }

  //gets view from the server and sets the state of the game
  gotView(view){
    this.setState(view.game);
  }

  render(){
    return (
    <div className="container">
    <div class="attack-btn" id="centered_buttons">
     <h2><Button class="attack1"> Attack 1 </Button>
     <Button class="attack2"> Attack 2 </Button>
     <Button class="attack3"> Attack 3 </Button>
     <Button class="attack4"> Attack 4 </Button></h2>
    </div>
    <div className="players">
      <div className="player1">
        <span><h3> Player 1: {this.userName} </h3></span>
        <div class="space"></div>
        <div className="progress-bar bg-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
          100
        </div>
        <br />
        <p class="progress-label"> Health </p>
        <div className="progress-bar bg-secondary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          0
        </div>
        <p class="progress-label"> Energy </p>
      </div>
      <div className="player2">
        <span><h3> Player 2 </h3></span>
        <div class="space"></div>
        <div className="progress-bar bg-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
          100
        </div>
        <br />
        <p class="progress-label"> Health </p>
        <div className="progress-bar bg-secondary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          0
        </div>
        <p class="progress-label"> Energy </p>
      </div>

    </div>

    </div>

    );
  }

}
