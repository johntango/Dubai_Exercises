// Description: This file is the background script for the extension. It listens for messages from content.js and popup.js and handles them accordingly.
// listens for messages from content.js
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    if (request.type === "textSelected") {
        chrome.storage.local.set({'highlightedText': request.text}, function() {
            if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({status: "Failed to set text"});
            } else {
            sendResponse({status: "Text set successfully"});
            }
        }
        );
    // check if popup is open already
    // open popup.html if not already open
        chrome.windows.getAll({populate:true},function(windows){
            var found = false;
            for(var i in windows){
                var win = windows[i];
                if(win.type == "popup" && win.tabs[0].url == chrome.runtime.getURL("popup.html")){
                    found = true;
                    break;
                }
            }
            if(!found) { // open popup
                chrome.windows.create({
                    url: chrome.runtime.getURL("popup.html"),
                    type: "popup",
                    width: 400,
                    height: 600
                });
            }
        });
    }
    }
    );



  
  

