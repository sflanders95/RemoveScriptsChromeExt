'use strict';
const _Version=parseFloat(1.01);
var _DEBUG;
var _Manifest;
var _DataStore = { lang: "en",
                   bookmarks: [{"name": "Center Green", x:384, y:384}] }; /* contents of [{name: "display name", x: 0, y: 0} */
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
  
  /* Update Labels and helptext based on lang  */
  resetLangDependentText()

  /* Add Page Events.   ***/
  document.getElementById('btnAdd').addEventListener('click', addBookmark);
  document.getElementById('btnBulkSave').addEventListener('click', bulkSave);
  document.getElementById('btnOpenBulk').addEventListener('click', toggleBulkScreen);
  document.getElementById('btnCloseBulk').addEventListener('click', toggleBulkScreen);
  $('#divLang').click(toggleLang);
  $('#divSettings').click(toggleSettings);
  
  $(document.body).delegate('input:text', 'keypress', function(e) {
      if (e.which === 13) { e.preventDefault(); addBookmark(); } });


  /* Last Steps, load data and draw screen   */
  $.getJSON( "../manifest.json", function( json ) {
       _Manifest = json;
       LOG( "manifest.json loaded: " + json );
    });
  retrieveJson(()=>{displayBookmarks(); resetLangDependentText();});
  gooInit();
  checkVersion();
  /* Each Panel is it's own Screen.  To start, turn off other screens */
  //$('#pnlBookMkMain').toggle(); 
  $('#pnlBookMkBulk').fadeOut();
  $('#pnlGenSettings').fadeOut(); 
});

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
    /* $('#pnlBookMkBulk').fadeOut(); */
    $('#pnlGenSettings').fadeOut(); 
  }
}

function resetLangDependentText() {
  /* Set Language dependent Labels: */
  document.getElementById('divLang').innerText = gStr('flag');
  document.getElementById('divLang').title = gStr('flag') + ' ' + gStr('flagHelpText');
  document.getElementById('btnAdd').innerText = gStr('btnAdd');
  document.getElementById('btnAdd').title = gStr('btnAddHelpText');
  document.getElementById('txtBMName').title = gStr('txtBMNameHelpText');
  document.getElementById('txtCoordX').title = gStr('txtCoordXHelpText');
  document.getElementById('txtCoordY').title = gStr('txtCoordYHelpText');
  document.getElementById('divNewBookmark').innerText = gStr('divNewBookmark');
  document.getElementById('divBookmarks').innerText = gStr('divBookmarks');
  document.getElementById('divBulkEditLbl').innerText = gStr('divBulkEditLbl');
  $('#btnOpenBulk').text(gStr('btnOpenBulk'));
  $('#btnOpenBulk').prop('title', gStr('btnOpenBulkHelpText'));
  $('#btnCloseBulk').text(gStr('btnCloseBulk'));
  $('#btnCloseBulk').prop('title', gStr('btnCloseBulkHelpText'));
}

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

function moveToLocation(bmIdx) {
  if (!bmIdx) { return false; }
  var bmObj = _DataStore.bookmarks[bmIdx] || null;
  LOG('Bookmark Event: '+bmIdx+' ' + JSON.stringify(bmObj));
  if (!bmObj) { setStatus('Unknown Error: Bookmark object not found'); return null; }
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!isURLAllowed(tabs[0].url)) {
       LOG('Error: Not on authorized url'); return false;
    } else {
      chrome.tabs.sendMessage(tabs[0].id, {"x":bmObj.x,"y":bmObj.y}, function(response) {
        setStatus('main.js: response to move: ' + response);
        console.log(new Date().toISOString() + 'TestBtn: response=' + response||'null');
        if (response && response.toString().indexOf('Err') == -1)
          window.close();
      });
    }
  });
}

function toggleBulkScreen() {
  $('#pnlBookMkBulk').toggle({duration:500, easing: "swing"});
  $('#pnlBookMkMain').toggle({duration:500, easing: "swing"});
}

function addBookmark() {
  var oName = document.getElementById('txtBMName');
  var oX = document.getElementById('txtCoordX')
  var oY = document.getElementById('txtCoordY');

  // if (name.length > 0 && x.length > 0 && y.length > 0) {
  if (oName.checkValidity() && oX.checkValidity() && oY.checkValidity()) {
    var bmObj = newBookmark(oName.value.trim(), parseInt(oX.value.trim()), parseInt(oY.value.trim()));
    setStatus('Validity Passed: Adding Bookmark: ' + JSON.stringify(bmObj));
    insertBookmark(bmObj);
    displayBookmarks();
  } else {
    setStatus(gStr('ErrAddingBookmark'));
  }
}

/* Display the list of screens on the left column. */
function displayBookmarks(jsonData) {
  jsonData = jsonData || _DataStore || newDataObj();
  var divBMList = document.getElementById('divBookmarkList');
  divBMList.innerHTML = ''; /* Clear current Items: */
  if (!jsonData.bookmarks) { setStatus('No Bookmark Data'); return false; }

  for (var i = 0; i < jsonData.bookmarks.length; i++) {
    var divBMRow = cdefs('<div class="bookmarkRow"></div>');
    divBMList.appendChild(divBMRow);

    var divDel = cdefs('<div class="del"> ❌ </div>'); /* ❌ ❎ */
    divDel.setAttribute('title', gStr('deleteIconHelpText') + ': ' + jsonData.bookmarks[i].name);
    divDel.setAttribute('bmData', i);
    divDel.addEventListener('click', (e)=>{deleteBookmark(e.target.getAttribute('bmData'))});
    divBMRow.appendChild(divDel);

    var divBMName= cdefs('<div class="bookmarkName"></div>');
    divBMName.setAttribute('bmData', i);
    divBMName.innerText = jsonData.bookmarks[i].name + ' ('+ jsonData.bookmarks[i].x +', '+ jsonData.bookmarks[i].y +')'; /* auto html encodes */
    divBMName.setAttribute('title', gStr('GoToHelpText') + ': ' + divBMName.innerText);
    divBMName.addEventListener('click', (e)=>{moveToLocation(e.target.getAttribute('bmData'))});
    divBMRow.appendChild(divBMName);
  }
  updateBulkScreen();
}

function bulkSave() {
  setStatus('Bulk Save:');
  var txt = $('#txtAreaBulk').val().trim();
  try { 
    _DataStore = JSON.parse(txt, (key, val)=>{
        if (key=="x"||key=="y") return parseInt(val);
        else return val; });
    storeJson(_DataStore);
    displayBookmarks();
    toggleBulkScreen();
  } catch (e) {
    alert(e.message);
    setStatus('Error Saving Bulk Data: ' + e.message);
  }
}

function updateBulkScreen() {
   _DataStore = _DataStore || newDataObj();
   var txt = JSON.stringify(_DataStore); //, (k,v)=>{
      //   if (k=="name") return v.replace(/'/g, "\\'"); /* quote single quotes */
      //   else return v;
      // })
   txt = txt.replace(/{"name/g, '\n{"name');  /* add newlines for readability */
   txt = txt.replace(/,"lang/g, ',\n"lang');   
   $('#txtAreaBulk').val(txt);
}

/* Begin JSON List management ************************************************/
/* creates and returns a blank new base data Object for this page. 
 * lang: the 2 digit language code. used for this page. */
function newDataObj(lang) {
  return { "lang": (lang || getLang()), 
           "bookmarks": [] };
}

/* Creates and returns a new bookmark object. */
function newBookmark(bmName ,coordX, coordY) {
  return { "name": bmName, "x": (coordX || "0"), "y": (coordY || "0") };
}

/* Inserts a bookmarkat the beginning or end of the list.
 * oBookmark, the bookmark object most likely created by the function newBookmark()
 * append: [default:true], add item to end of list, else insert at beginning. */
function insertBookmark(oBookmark, append) {
  if (_DataStore == null) _DataStore = newDataObj();
  if (append == null) append = true;
  if (append)
    _DataStore.bookmarks.push(oBookmark);
  else
    _DataStore.bookmarks.unshift(oBookmark);
  storeJson(_DataStore);
  updateBulkScreen();
}

/* Deletes a bookmarkat from the list.
 * oBookmark, the bookmark object most likely created by the function newBookmark()
 * */
function deleteBookmark(idx) {
  if (_DataStore == null) return;
  setStatus('Deleting Bookmark #' + idx);
  _DataStore.bookmarks.splice(idx,1);
  storeJson(_DataStore);
  displayBookmarks();
  updateBulkScreen();
}

/* End JSON List management **************************************************/

/* Begin Data Storage ********************************************************/
function storeJson(oJson) {
  if (oJson == null)
    chrome.storage.sync.remove(['Paratus'], ()=>{});
  else
    chrome.storage.sync.set({"Paratus": oJson}, function(){
      LOG('Value is set to ' + JSON.stringify(oJson));
    });
}

function retrieveJson(fcallBack) {
  chrome.storage.sync.get(['Paratus'], (result)=>{
    /*LOG('Retrieved JSON string = ' + JSON.stringify(result.ChromeTabs));*/
    _DataStore = result.Paratus;
    if (fcallBack)
      fcallBack(_DataStore);
  });
}
/* End Data Storage **********************************************************/

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

function VersionLoad() {
  try {
  var ver=parseFloat(cdefs(this.responseText).innerText);
  if (ver > _Version) {
    var d = cdefs('<span>There is a newer version available. </span>');
    var a = cdefs('<a href="https://sflanders95.github.io/EmpireMillenniumChromeExt/">Click Here to get it.</a>');
    a.addEventListener('click', (e)=>{openTab(e.target.href)});
    document.getElementById('divNewVersion').style.display = 'block';
    document.getElementById('divNewVersion').appendChild(d);
    document.getElementById('divNewVersion').appendChild(a);
    setStatus('This Version: ' + _Version + ' Latest Version: ' + ver + ' - There is a newer version available');
  } else {
    setStatus('This Version: ' + _Version + ' Latest Version: ' + ver + ' - This extension is up to date');
  }
  } catch (e){;}
}

function checkVersion() {
  var url='https://sflanders95.github.io/EmpireMillenniumChromeExt/EMWChromeExtVer';
  /* var url='http://127.0.0.1:4000/EMWChromeExtVer'; */
  var client = new XMLHttpRequest();
  client.onload = VersionLoad;
  client.open("GET", url);
  client.send();
}

function gooInit() {
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-127176852-1', 'auto');
ga('send', 'pageview', '/EMWChromeExt.html');
}
/*****************************************************************************
 * End: Logging Functions                                                    *
 *****************************************************************************/
