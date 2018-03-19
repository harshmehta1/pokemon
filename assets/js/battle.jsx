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
    this.state = {p1health: 100, p1energy: 0,  p2health: 100, p2energy: 0,};

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
    <div className="players">
      <div className="player1">
        <span><h2> Player 1 </h2></span>
        <Button className="attack-btn"> Attack 1 </Button>
        <Button className="attack-btn"> Attack 2 </Button>
        <Button className="attack-btn"> Attack 3 </Button>
        <Button className="attack-btn"> Attack 4 </Button>
        <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
          100
        </div>
        <br />
        <p> Health </p>
        <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          0
        </div>
        <p> Energy </p>
      </div>
      <div className="player2">
        <span><h2> Player 2 </h2></span>
        <Button className="attack-btn"> Attack 1 </Button>
        <Button className="attack-btn"> Attack 2 </Button>
        <Button className="attack-btn"> Attack 3 </Button>
        <Button className="attack-btn"> Attack 4 </Button>
        <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
          100
        </div>
        <br />
        <p> Health </p>
        <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          0
        </div>
        <p> Energy </p>
      </div>

    </div>

    </div>

    );
  }

}
