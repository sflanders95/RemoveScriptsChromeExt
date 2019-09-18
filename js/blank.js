console.log('blank.js' + new Date().toLocaleString());

/*********** Onload Init ***********/
document.addEventListener("DOMContentLoaded", function() {
  /* Get the data from storage and display */
  chrome.storage.local.get(['lastChatSnapshot'], (result)=>{
    console.log('document loaded. storage item = ' + result);
    if (result) {
      var snap = result.lastChatSnapshot;
      displayChat(snap.alliance, snap.global, snap.timeStamp);
    }
  });
});

function displayChat(sAl, sGl, timeStamp) {
  /* var sHtml = '<html><head><meta charset="utf-8">';
     sHtml += '<link href="https://game.empiremillenniumwars.com/game.css?vLive.1.35.0" rel="stylesheet">';
     sHtml += '<style>body {background-color:rgba(0,0,39,.75);color:#d8d8d8;}.button--size-fill{height:unset;}</style>';
     sHtml += '</head><body>';  */
  //new RegExp(pattern, "g")
  sGl = sGl.replace(new RegExp('', "g"),'📍');  /* ''.charCodeAt(0) = 59766 */
  sAl = sAl.replace(new RegExp('', "g"),'📍');  /* ''.charCodeAt(0) = 59766 */
  var sHtml = '<table><tr><td colspan="2">' + timeStamp;
  sHtml += '</td></tr><tr><td>Global</td><td>Alliance</td></tr><tr><td>';
  sHtml += sGl + '</td><td>' + sAl;
  sHtml += '</td></tr></table>'; /* </body></html>'; */
  document.getElementById("chatlog").innerHTML = sHtml;
  // document.body.firstChild.innerHTML = sHtml;
}

