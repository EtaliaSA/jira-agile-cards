
chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {urlContains: 'atlassian.net'},
          })
        ],
        actions: [
          new chrome.declarativeContent.ShowPageAction()
        ]
      }
    ]);
  });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message === 'pageActionClicked') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {event: "popup-onclick"}, function(response) {
        if (response.type == "single-card") {
          chrome.extension.getViews({"type": "popup"})[0].switchToCards("single-card");
        }
      })
    });
  } else if (message === 'readXmlUrl') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {event: "readXmlUrl"}, function(response) {
        chrome.extension.getViews({"type": "popup"})[0].setData(response);
      })
    });
  }
});

