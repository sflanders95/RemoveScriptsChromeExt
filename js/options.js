var _Manifest;
console.log(new Date().toISOString() + ' options.js file');

/* Onload Init ***********/
/* $(()=>{   <-- buggy?  should be consistent document.load() */
document.addEventListener("DOMContentLoaded", function() {
  /* setStatus(new Date().toISOString() + ' options.js:init'); */
  if (!_Manifest) {
    $.getJSON( "../manifest.json", function( json ) {
        _Manifest = json;
        LOG( "manifest.json loaded: " + json );
      });
  }

  /* Event Declarations */
  document.getElementById('btnFontSize').addEventListener('click', ()=>{changeFontSize((resp)=>{setStatus('Chat Font changed to ' + resp + 'px');})});
  document.getElementById('btnCaptureChat').addEventListener('click', captureChat);
  $('#numX0').keyup(distanceFormula);
  $('#numY0').keyup(distanceFormula);
  $('#numX1').keyup(distanceFormula);
  $('#numY1').keyup(distanceFormula);


  /* $('#udFontSize').val('-1'); 
  changeFontSize((resp)=>{$('#udFontSize').val(resp);}); */

});
/* End Onload Init ***********/

/* Call the game window. If #udFontSize = -1 then just request current font Size. */
function changeFontSize(callBack) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!isURLAllowed(tabs[0].url)) {
       LOG('Error: Not on authorized url'); return false;
    } else {
      var fs = parseFloat($('#udFontSize').val()) || 12;
      setStatus('Setting Font Size: ' + fs);
      chrome.tabs.sendMessage(tabs[0].id, {"chatFontSize":fs}, function(response) {
        callBack(response);
      });
    }
  });
}

/* sqrt( (x0-x1)^2 + (y0-y1)^2 )  */
function distanceFormula() {
  var x0 = $('#numX0').val().trim();
  var y0 = $('#numY0').val().trim();
  var x1 = $('#numX1').val().trim();
  var y1 = $('#numY1').val().trim();
  if (isNaN(x0) || isNaN(y0) || isNaN(x1) || isNaN(y1))
    $('#numDist').val('err');
  else {
    var dx = parseInt(x0) - parseInt(x1);
    var dy = parseInt(y0) - parseInt(y1); 
    $('#numDist').val( Math.sqrt(dx**2+dy**2) );
  }
}

var lastChat;
function captureChat() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!isURLAllowed(tabs[0].url)) {
       LOG('Error: Not on authorized url'); return false;
    } else {
      var fs = parseFloat($('#udFontSize').val()) || 12;
      setStatus('Setting Font Size: ' + fs);
      chrome.tabs.sendMessage(tabs[0].id, {"captureChat":"true"}, function(response) {
        // chrome.tabs.create({"url":"chrome://newtab"})
        lastChat = response;
        if (response && response.global) {
          renderChat(response);
          $('#divChatStatus').val(response.timeStamp);
        }
        if (response && response.error)
          setStatus('ChatResponseCd: ' + response.error);
        else
          setStatus('ChatResponseUnknown: ' + response);
      });
    }
  });
}

var lastRender;
function renderChat(request) {
  console.log('rendering chat');
  chrome.tabs.create({"url":chrome.extension.getURL("html/blank.html")}, function(tab){ ; });
}