'use strict';
var _DEBUG;
var _Manifest;

//              tagName      Default/current CheckedStatus     Tallies
var _Tags = [ {"name":"script", "checked": true, "TotalRemoved": 0, "NumDeleted":0, "NumFound": 0},
              {"name":"iframe", "checked": true, "TotalRemoved": 0, "NumDeleted":0, "NumFound": 0},
              {"name":"video",  "checked": true, "TotalRemoved": 0, "NumDeleted":0, "NumFound": 0},
              {"name":"embed",  "checked": true, "TotalRemoved": 0, "NumDeleted":0, "NumFound": 0},
              {"name":"style",  "checked":false, "TotalRemoved": 0, "NumDeleted":0, "NumFound": 0},
              {"name":"link",   "checked":false, "TotalRemoved": 0, "NumDeleted":0, "NumFound": 0} ];


var _LastResponse;


/* US🇺🇸 france🇫🇷 germany🇩🇪 Mexico🇲🇽 */
var sDefaults = {
    "en": { "flag": "🇺🇸",
            "flagHelpText": "US English",
            "btnAdd" : "💾 Add Bookmark",
            "btnAddHelpText" : "💾 Enter desired x and y coordinates and click here to save",
            "deleteIconHelpText": "Delete This Bookmark",
            "GoToHelpText": "Go to Bookmark",
            "txtBMNameHelpText": "Enter a bookmark name (at least 3 characters)",
            "divNewBookmark": "New Bookmark:",
            "divBookmarks": "Bookmarks:",
            "divBulkEditLbl": "Bulk Edit:",
            "txtCoordXHelpText": "The X Coordinate",
            "txtCoordYHelpText": "The Y Coordinate",
            "ErrAddingBookmark": "Error Adding Bookmark: check the fields that are red",
            "btnOpenBulk": "Goto Bulk Input", 
            "btnOpenBulkHelpText": "Open Bulk Input Screen",
            "btnCloseBulk": "Exit Bulk Input", 
            "btnCloseBulkHelpText": "Return to Normal Input Screen"
          },
    "de": { "flag": "🇩🇪",
            "flagHelpText": "Deutsche",
            "btnAdd": "Lesezeichen Erstellen",
            "btnAddHelpText": "Lesezeichen Erstellen",
            "deleteIconHelpText": "Entfernen Sie dieses Lesezeichen",
            "GoToHelpText": "Gehe zu Standort",
            "txtBMNameHelpText": "Geben Sie einen Lesezeichennamen ein (3 oder mehr Zeichen)",
            "divNewBookmark": "Neues Lesezeichen:",
            "divBookmarks": "Lesezeichen:",
            "divBulkEditLbl": "Massenbearbeitung:",
            "txtCoordXHelpText": "The X Coordinate",
            "txtCoordYHelpText": "The Y Coordinate",
            "ErrAddingBookmark": "Fehler beim Hinzufügen eines Lesezeichens: Überprüfen Sie die roten Felder",
            "btnOpenBulk": "Massendateneingabe", 
            "btnOpenBulkHelpText": "Gehen Sie zur Massendateneingabe",
            "btnCloseBulk": "Hauptbildschirm", 
            "btnCloseBulkHelpText": "Rückkehr zum Hauptbildschirm"
          }
}; /* sDefaults :: End String Definitions */

/* init */
document.addEventListener("DOMContentLoaded", function() {
  setDebug(false);
  LOG('ChromeExt:main.js init()');
  
  updateTagStatus();
  DrawTextBoxes();
  DrawStatus(); // todo: wrap in a timer...

  /* Update Labels and helptext based on lang  */
  // resetLangDependentText()

  /* Add Page Events.   ***/
  document.getElementById('btnRemove').addEventListener('click', removeTags);


  $('#pnlMain').fadeIn();
  
});


function removeTags() {
  setStatus('removing tags');
  // var msg = Object.create(_Message);
  _Tags.forEach((tag)=> {
    tag.checked = $('#cb' + tag.name)[0].checked;
  });
  var msg = {"command":"REMOVE", "tags": _Tags};
  SendContentScriptMessage(msg);

  // msg.script = $('#cbscript')[0].checked ? 1 : 0;
  LOG(msg.toString());
  return msg;
}

function updateTagStatus() {
  var msg = {"command":"UPDATE", "tags": _Tags };
  SendContentScriptMessage(msg);
}

function SendContentScriptMessage(msg)
{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
      setStatus('main.js: response to msg was: ' + response);
      console.log(new Date().toISOString() + 'updateTagStatus: response=' + response||'null');
      if (response['tags'])
         _Tags = response['tags'];
      _LastResponse = response;
      DrawStatus();
    });
  });
}



function DrawTextBoxes() {
  var container = $('#checkBoxes')[0];
  container.hidden = true;
  var counter = 0;
  var groupDiv;
  _Tags.forEach((tag)=> {
    if (counter == 0) {
      groupDiv = document.createElement('div');
      container.appendChild(cdefs('<br />'));
      container.appendChild(groupDiv);
      counter++;
    } else {
      counter = (counter == 2) ? 0 : counter + 1;
    }
    var str = '<div class="checkboxContainer"><input type="checkbox" ' + (tag.checked ? 'checked ':'')  + 
              'id="cb' + tag.name + '"> &nbsp; &lt; <label class="tagName" for="cb' + tag.name + 
              '"> ' + tag.name + ' </label> &gt; </div>';
    groupDiv.appendChild(cdefs(str));
  });
  $('#checkBoxes').fadeIn(3000);
}

function DrawStatus() {
  var container = $('#statusContainer')[0];
  $('#statusContainer').text('');
  container.hidden = true;

  _Tags.forEach((tag)=> {
    var str = '<div class="leftMargin10"><span class="totRemoved">' + tag.NumDeleted +
              '</span> &lt;<span class="tagName">' + tag.name + '</span>&gt; tags removed.  <span class="tagsFound">' +
              tag.NumFound + '</span> found.</div>';
    container.appendChild(cdefs(str));
  });
  $('#statusContainer').fadeIn();
}

function getTagCount(tagName) {
  return 42;
}
/*

function cdefs(s){
  var d = document.createElement('div');
}

function toggleLang() {
  if (!_DataStore) return;
  _DataStore.lang = (_DataStore.lang == 'en') ? 'de' : 'en';
  storeJson(_DataStore);
  displayBookmarks();
  updateBulkScreen();
  resetLangDependentText();
  setStatus('Language Changed');
}
function toggleSettings() {
  if ($('#pnlGenSettings').css('display') == 'none') {
    $('#pnlBookMkMain').fadeOut(); 
    $('#pnlBookMkBulk').fadeOut();
    $('#pnlGenSettings').fadeIn(); 
  } else {
    $('#pnlBookMkMain').fadeIn(); 
    $('#pnlGenSettings').fadeOut(); 
  }
}
*/

function resetLangDependentText() { ; }
//   /* Set Language dependent Labels: */
//   document.getElementById('divLang').innerText = gStr('flag');
//   document.getElementById('divLang').title = gStr('flag') + ' ' + gStr('flagHelpText');
//   document.getElementById('btnAdd').innerText = gStr('btnAdd');
//   document.getElementById('btnAdd').title = gStr('btnAddHelpText');
//   document.getElementById('txtBMName').title = gStr('txtBMNameHelpText');
//   document.getElementById('txtCoordX').title = gStr('txtCoordXHelpText');
//   document.getElementById('txtCoordY').title = gStr('txtCoordYHelpText');
//   document.getElementById('divNewBookmark').innerText = gStr('divNewBookmark');
//   document.getElementById('divBookmarks').innerText = gStr('divBookmarks');
//   document.getElementById('divBulkEditLbl').innerText = gStr('divBulkEditLbl');
//   $('#btnOpenBulk').text(gStr('btnOpenBulk'));
//   $('#btnOpenBulk').prop('title', gStr('btnOpenBulkHelpText'));
//   $('#btnCloseBulk').text(gStr('btnCloseBulk'));
//   $('#btnCloseBulk').prop('title', gStr('btnCloseBulkHelpText'));
// }

/* Is the active tab one of the ones we pay attention to? */
function isURLAllowed(sUrl) {
  sUrl = sUrl.toLowerCase();
  var validUrls = _Manifest.browser_action.matches;
  var r = false;
  for (var i = 0; i < validUrls.length; i++) {
    /* setStatus('sUrl: ' + sUrl);
    setStatus('manifest: ' + validUrls[i].replace('*', '').toLowerCase()); */
    r = r || (sUrl.indexOf(validUrls[i].replace('*', '').toLowerCase()) != -1);
  } 
  return r;
}

/*****************************************************************************
 * Begin: Functions to Set Labels based on Language Settings.                *
 *****************************************************************************/
/* returns the first two characters of the localization settings.  
 * e.g.: en-US returns en */
function getLang() {
  if (_DataStore && _DataStore.lang)
    return _DataStore.lang || 'en';
  else
    return navigator.languages[0].substring(0,2) || 'en';
}
/* get Localized String.
 * sKey is the json key name defined in sDefaults global var.
 * if an error occured, sDefaultVal is returned.
 * if defaultVal is not present, then sKey is returned. */
function gStr(sKey, defaultVal){
  var msgs = sDefaults[getLang()] || sDefaults.en;
  var val = msgs[sKey] || defaultVal || '';
  if (val == '') val = sDefaults.en[sKey] || defaultVal || sKey; /* still nothing, then try 'en' */
  return val;
}
/*****************************************************************************
 * End: Functions to Set Labels based on Language Settings.                  *
 *****************************************************************************/


/*****************************************************************************
 * Begin: Logging Functions                                                  *
 *****************************************************************************/
function setDebug(isDebug)
{
  _DEBUG = isDebug;
  if (isDebug) $('#divDEBUG').show();
  else $('#divDEBUG').hide();
  /*document.getElementById('divDEBUG').style.display = ((isDebug) ? "block" : "none");*/
}
function getDebug()
{
  return _DEBUG;
}

function cdefs(s){
  var d = document.createElement('div');d.innerHTML=s.trim();return d.firstChild;
}

function setStatus(str) {
  LOG('statusmsg: ' + str);
  var newmsg = cdefs('<div class="statusMsg"></div>');
  newmsg.innerText = str;
  var o = document.getElementById('divStatus');
  o.insertBefore(newmsg, o.firstChild); /* tested: works even if no children */
  /* $(newmsg).toggle(8000,"linear",()=>{newmsg.parentNode.removeChild(newmsg)}); */
  /* Pause a second, then start timer to finally delete the msg node */
  setTimeout(()=>{$(newmsg).fadeOut(5000,"linear",()=>{newmsg.parentNode.removeChild(newmsg)});}, 1500);
  /* $(newmsg).fadeOut(5000,"linear",()=>{newmsg.parentNode.removeChild(newmsg)}); */
}

function LOG(str) {
  console.log('[BCM]: ' + str);
  if (_DEBUG) {
    var lEntry = cdefs('<div class="log"></div>');
    lEntry.innerText = str;
    document.getElementById('divLOG').appendChild(lEntry);
  }
}

function openTab(url) {
  setStatus('openTab: url = ' + url);
  chrome.tabs.create({"url":url, active:true});
}

function gooInit() {
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-127176852-1', 'auto');
ga('send', 'pageview', '/EMWChromeExt.html');
}
/* ****************************************************************************
 * End: Logging Functions                                                    *
 **************************************************************************** */
