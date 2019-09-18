
function captureChat() {
  var sDate = new Date().toLocaleString('en-US', {"hour12":false,"timeZoneName":'short'} );
  var resp = {"global":"","alliance":"","error":"","timeStamp":sDate};
  try {
    /* var al = $('.section-scrollable__content').cloneNode(true); */
    /* Global */
    var tabs = document.getElementsByClassName('tabs__navigation')[0]
    tabs.firstChild.click();
    var o = tabs.parentNode.parentNode.nextSibling.firstChild.cloneNode(true);
    o.style = '';
    resp.global = o.outerHTML;

    /* Alliance */
    tabs.firstChild.nextSibling.click()
    o = tabs.parentNode.parentNode.nextSibling.firstChild.cloneNode(true)
    o.style = '';
    resp.alliance = o.outerHTML;
    chrome.storage.local.set({"lastChatSnapshot": resp}); /* , ()=>{;}); */
  } catch (ex) { resp.error = ex.toString(); }    
  return resp;
}

function displayChat(sAl, sGl) {
  var sHtml = '<html><head><meta charset="utf-8">';
  sHtml += '<link href="https://game.empiremillenniumwars.com/game.css?vLive.1.35.0" rel="stylesheet">';
  sHtml += '<style>body {background-color:rgba(0,0,39,.75);color:#d8d8d8;}.button--size-fill{height:unset;}</style>';
  sHtml += '</head><body><table><tr><td>Global</td><td>Alliance</td></tr><tr>';
  sHtml += sAl + '</td><td>' + sGl;
  sHtml += '</td></tr></table></body></html>';
  document.body.innerHTML = sHtml;
}

function mv2(x, y) {
console.log(new Date().toISOString() + ' Move Command Received: ('+x+','+y+')');
var www = document.getElementsByClassName("hud-world-map-bar__coordinates")[0];
//if (!document.getElementsByClassName("hud-world-map-bar__coordinates")[0]) {return 'Error: Map screen not found';}
if (!www) {return 'Error: Map screen not found';}
www = www.children[0];
www.click();
setTimeout(()=> {
  var base=document.getElementsByClassName("screen-coordinates-search__coordinates")[0];
  if (!base) { return 'Error: base coordinate screen not found.'; }
  //console.log(base);
  valx=base.children[1].children[1].children[0].children[0].value;
  if (x>valx) {for (i=valx; i < x; i++) {
  base.children[1].children[1].children[1].children[0].click(); } }
  else { for (i=valx; i > x; i--) {
  base.children[1].children[1].children[1].children[1].click(); } }

  valy=base.children[2].children[1].children[0].children[0].value;
  if (y>valy) {for (i=valy; i < y; i++) {
  base.children[2].children[1].children[1].children[0].click(); } }
  else { for (i=valy; i > y; i--) {
  base.children[2].children[1].children[1].children[1].click(); } }
  setTimeout(()=>{
    document.getElementsByClassName("button flex-direction-row button--size-expand button--style-primary button--shape-rounded button--layout-column")[0].click();
    }, 200)}
  , 200);
return 'Success';
}

/* if size = -1, return existing mod (or 10) if it exists. Otherwise 
 * perform a 'set' command */ 
function changeChatFontSize(size) {
  if (isNaN(size)) size = 14;
  var oStyle = document.getElementById('CustomStyle0x7B3');
  if (!oStyle) {
      oStyle = cdefs('<style id="CustomStyle0x7B3"></style>');
      document.body.appendChild(oStyle);
  }
  oStyle.innerText = '.chat__container{font-size:' + size + 'px;}';
  return size;
}

// function cdefs(s){var d = document.createElement('div');d.innerHTML=s.trim();return d.firstChild;}

function iAmHere() {
  document.body.appendChild(cdefs('<style>#OxBX{height:110px;left:20px;top:20px;width:110px;background:#fff;opacity: 0.9;border-radius:6px;padding:1px;transition:all 0.4s;overflow:hidden;position:absolute;z-index:210;border: 3px solid #800;}</style>'));
  var bx=cdefs('<div id="OxBX">iAmHere</div>');
  document.body.appendChild(bx);
  bx.appendChild(cdefs('<style>#OxBN{top:-4px;float:right;position:relative</style>'));
  bx.appendChild(cdefs('<a id="OxBN" title="Wyvern Bookmarks">💬</a>'));
}
//iAmHere();

function cdefs(s){
  var d = document.createElement('div');d.innerHTML=s.trim();return d.firstChild;
}

var aEMWContentScriptLoaded=true;



/* MAIN: */
//if (window.self !== window.top) { /* Only if inside of iFrame */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var resp;
    console.log(new Date().toISOString() + ' message: ' + (JSON.stringify(request) || 'null'));
    if (request.x) {
      resp = mv2(request.x,request.y) || null;
    } 
    else if (request.chatFontSize) {
      resp = changeChatFontSize(request.chatFontSize) || null;
    }
    else if (request.captureChat) {
      resp = captureChat();
    }
    else if (request.alliance) {
      resp = displayChat(request.alliance, request.global);
    }
    else {
      resp = 'Unknown command: ' + JSON.stringify(request);
    }
    sendResponse(((resp != null) ? resp : 'ContentScript.js: Received request.  Unknown Error') );
  });
//}

// log from background script.
console.log(new Date().toISOString() + ' contentScript');
/* setInterval(()=>{ console.log(new Date().toISOString() + ' contentScript'); }, 5000); */


