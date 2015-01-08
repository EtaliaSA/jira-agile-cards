chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.event === "popup-onclick") {
    var jira = document.getElementById("jira");
    if (jira && jira.getAttribute("class") && jira.getAttribute("class").indexOf("navigator-issue-only") != -1) {
      sendResponse({type: "single-card"});
    }
  } else if (request.event === "readXmlUrl") {
    var xmlUrl = document.getElementById("jira.issueviews:issue-xml").href;
    var id = document.getElementById("key-val").text;
    var title = document.getElementById("summary-val").childNodes[0].nodeValue;
    sendResponse({xmlUrl: xmlUrl, id: id, title: title});
  }
});
