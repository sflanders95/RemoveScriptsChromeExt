function cdefs(s){
  var d = document.createElement('div');d.innerHTML=s.trim();return d.firstChild;
}
var aEMWContentScriptLoaded=true;

/* MAIN: */
//if (window.self !== window.top) { /* Only if inside of iFrame */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var resp;
    if (isTargetDocument) console.log('top.document == document isTargetDocument');
    // console.log(new Date().toISOString() + ' message: ' + (JSON.stringify(request) || 'null'));
    if (request['command'] && request.command == 'REMOVE') {
      // console.log('contentScript: remove requested ' + this);
      resp = {"Message":"User Requested Removal", "tags": DeleteTags(request.tags) };
    } 
    else if (request['command'] && request['command'] == 'UPDATE') {
      //console.log('contentScript: update requested ' + this);
      resp = {"Message":"User Requested Update", "tags": UpdateTagCounts(request.tags)};
    }
    else {
      resp = {"Message":'Error: NotSureWhattaDo ' + JSON.stringify(request), "tags": request.tags};
    }
    sendResponse(((resp != null) ? resp : 'ContentScript.js: Received request.  Unknown Error') );
  });
//}

function DeleteTags(tags) {
  tags.forEach((tag)=> {
    var num = document.getElementsByTagName(tag['name']).length;
    tag['NumFound'] = num;
    if (tag['checked']) {
      tag['NumDeleted'] = deltag(tag['name']);
      tag['TotalRemoved'] += tag['NumDeleted'];
      console.log('ContentScript: "' + tag['name'] + '" has ' + num + ' occurances');
    }
  });
  return tags;
}

function UpdateTagCounts(tags)
{
  tags.forEach((tag)=> {
    var num = document.getElementsByTagName(tag['name']).length;
    tag['NumFound'] = num;
    console.log('ContentScript: "' + tag['name'] + '" has ' + num + ' occurances');
  });
  return tags;
}

var isTargetDocument = () => {
  try {
    return (top.document == document);
  } catch (error) {
    return false;
  }
};


function deltag(name){var c=0;while(document.getElementsByTagName(name).length>0){document.getElementsByTagName(name)[0].remove();c++}return c}

// Common Usage of deltag.  To stop a really annoying webpage:
//deltag('script'); deltag('video'); deltag('iframe'); deltag('noscript')

// delete tags with specific attributes. set attr with attribute or attribute=value
//function delattr(attr){var c=0;while(document.querySelectorAll('['+attr+']').length>0){document.querySelectorAll('['+attr+']')[0].remove();c++}return c}


// log from background script.
console.log(new Date().toISOString() + ' contentScript');
/* setInterval(()=>{ console.log(new Date().toISOString() + ' contentScript'); }, 5000); */


