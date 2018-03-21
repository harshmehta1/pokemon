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
    this.state = {player1: [], player2: [], poke1: [], poke2: [], state: 1};

    this.channel.join()
      .receive("ok", this.gotView.bind(this))
      .receive("error", resp => {console.log("Unable to join", resp) });
  }

  //gets view from the server and sets the state of the game
  gotView(view){
    this.setState(view.game);
  }

  //states: 0=waiting for second player; 1=player 1 turn; 2=player 2 turn;
  //3=game over

  render(){
    if (this.state.state == 0) {
    return (
      <div className="container">
         <br />
         <br />
         <h1> Waiting On Second Player..... </h1>
      </div>
    )}
    else if (this.state.state == 1) {
    return (
    <div className="container">
    <div className="players">
      <div className="player1">
        <span><h2> Player 1: Your Move </h2></span>
        <Button class="attack-btn"> Attack 1 </Button>
        <Button class="attack-btn"> Attack 2 </Button>
        <Button class="attack-btn"> Attack 3 </Button>
        <Button class="attack-btn"> Attack 4 </Button>
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
        <span><h2> Player 2 </h2></span>
        <br /><br />
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

    )}
    else if (this.state.state == 2) {
    return (
    <div className="container">
    <div className="players">
      <div className="player1">
        <span><h2> Player 1 </h2></span>
        <br /><br />
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
        <span><h2> Player 2: Your Move </h2></span>
        <Button class="attack-btn"> Attack 1 </Button>
        <Button class="attack-btn"> Attack 2 </Button>
        <Button class="attack-btn"> Attack 3 </Button>
        <Button class="attack-btn"> Attack 4 </Button>
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

    )};
  }

}
