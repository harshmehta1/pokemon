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
    this.state = {skel: []};

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
      <h1>SAMPLE CONTENT - GAME WILL GO HERE!</h1>
    </div>
    )
  };

}
