document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(["singleCard", "cards"], function(result) {
    if (result.singleCard) {
      var urls = new Array();
      urls.push(result.singleCard);
      printCards(urls);
      chrome.storage.local.remove("singleCard");
    } else if (result.cards) {
      var urls = new Array();
      for (var i=0; i<result.cards.length; i++) {
        urls.push(result.cards[i].xmlUrl);
      }
      printCards(urls);
    }
  });
});

function print(xml) {
  // Get values from xml
  var item = xml.getElementsByTagName("item")[0];
  var id = domValue(item, 'key');
  var typeIcon = domAttribute(item, 'type', 'iconUrl');
  var priorityIcon = domAttribute(item, 'priority', 'iconUrl');;
  var title = domValue(item, 'summary');
  var description = domValue(item, 'description');
  var sp_estimate = getItemCustomField(item, 'Story Points');
  var sp_remaining = "";
  // Clone template and populate it
  var template = document.getElementById("card-template").cloneNode(true);
  template.setAttribute("id", "card-" + id);
  template.getElementsByTagName("img")[0].setAttribute("src", typeIcon);
  template.getElementsByTagName("img")[1].setAttribute("src", priorityIcon);
  template.getElementsByTagName("header")[0].getElementsByTagName("span")[0].innerHTML = id;
  template.getElementsByTagName("header")[0].getElementsByTagName("span")[1].innerHTML = title;
  template.getElementsByTagName("footer")[0].getElementsByTagName("span")[1].innerHTML = sp_estimate;
  template.getElementsByTagName("article")[0].innerHTML = description;
  document.getElementById("cards").appendChild(template);
}

function printCards(urls) {
  for (i=0; i<urls.length; i++) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urls[i], false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var xml = xhr.responseXML;
        print(xml);
      }
    }
    xhr.send();
  }
}

function domValue(el, name) {
  if (el.getElementsByTagName(name)[0].childNodes[0]) {
    return el.getElementsByTagName(name)[0].childNodes[0].nodeValue;
  }
  return '';
}

function domAttribute(el, name, attr) {
  return el.getElementsByTagName(name)[0].getAttribute(attr);
}

function getItemCustomField(item, name) {
  var fields = item.getElementsByTagName("customfields")[0].childNodes;
  for (var i=0; i<fields.length; i++) {
    var field = fields[i];
    if (field.nodeType == 3) {
      continue;
    }
    var fieldName = domValue(field, "customfieldname");
    if (fieldName == name) {
      return domValue(field.getElementsByTagName("customfieldvalues")[0], "customfieldvalue");
    }
  }
  return null;
}