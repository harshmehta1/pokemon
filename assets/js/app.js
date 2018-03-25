// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";
import socket from "./socket";
import play_game from "./battle";
import {Presence} from "phoenix";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"


function landing_init() {
  $("#user_game").keyup(() => {
    let name = $("#user_game").val();
    $("#add").attr("href", "/game/".concat(name));
  });
}

 


function start(){
  let root = document.getElementById('game');
  if(root) {
    let logins = {}
    let channel = socket.channel("games:" + window.gameName, {"userName": window.userName});
    play_game(root, channel);
    
    channel.on("presence_state", state => {
      logins = Presence.syncState(logins, state)
      console.log(logins)
     })
    
    channel.on("presence_diff", diff => {
      logins = Presence.syncDiff(logins, diff)
      console.log(logins)
     })
  }

  if (document.getElementById("landing")) {
    landing_init();
  }

}
var interval;
function toggleAnim(){
  var mv = document.getElementById('mover');
  var style = mv.style;
  if (style.webkitAnimationPlayState === 'running') {
    clearInterval(interval);
    style.webkitAnimationPlayState = 'paused';
  } else {
    style.webkitAnimationPlayState = 'running';
  }
}


function startSkill(){
  var i = 100; //1/5th of animation-duration.
  var val = 100; //1/5th of animation-duration.
  var called = false;
  interval = setInterval(increment, val);
  var pcTxt = document.getElementById("pc-dmg");
  var pcDmgTxt = document.getElementById("pc-dmg-txt");
  function increment(){
    if (called == false){
      toggleAnim();
      called = true;
    }
    pcTxt.innerHTML = i;
    if (i == val * 5){
      i = val;
      pcDmgTxt.innerHTML = "Low Effect";
    } else {
      if (i == (val * 2) || i == (val * 4)){
        pcDmgTxt.innerHTML = "Med Effect";
      } else if (i == (val * 3)){
        pcDmgTxt.innerHTML = "High Effect";
      } else if (i == val){
        pcDmgTxt.innerHTML = "Low Effect";
      }
      i = i + val;
    }
  }
}


$(start);


