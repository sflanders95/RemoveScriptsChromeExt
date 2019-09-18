'use strict';
var _DEBUG=false;

function commentedOut() {
console.log('Empire Millennium chat blocker background.js has started.');
var _ChatClass;

window.onload = () => { init(); }

function init() {
  _DEBUG = false;
  _ChatClass = 'chat__message';
  LOG('Background STARTED');
  doWork();
}

function doWork()
{
    var timerID = null;
    timerID = setInterval(function() {
      getSetting(SettingsKeys.ignoreText, function(val) { 
        LOG('Timer Event::_ignoreText = '+val+' '+new Date().getMilliseconds());
      } ); 
    }, 7000);
}

function getChatParentDiv() {
  var aryChat = document.getElementsByClassName(_ChatClass);
  return aryChat[0].parentNode.parentNode || 'error';
}
} /* end Commented Out */

function LOG(str) {
  console.log('[EMMCE]: ' + str);
  if (_DEBUG) {
    if (document.getElementById('LOG'))
    {
        var lEntry = document.createElement('div');
        lEntry.innerText = str;
        document.getElementById('LOG').appendChild(lEntry);
    }
  }
}


