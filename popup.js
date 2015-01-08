chrome.runtime.sendMessage('pageActionClicked');

function switchToCards(type) {
  if (type === 'single-card') {
    document.getElementById('unrecognized').style.display='none';
    document.getElementById('single-card').style.display='block';
    chrome.runtime.sendMessage('readXmlUrl');
    refreshSavedCards();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button#printSingleCard').addEventListener('click', printSingleCard);
  document.querySelector('button#addCard').addEventListener('click', addCard);
  document.querySelector('button#printCards').addEventListener('click', printCards);
  document.querySelector('button#emptyCards').addEventListener('click', emptyCards);
});

function setData(data) {
  document.getElementById('xmlUrl').value = data.xmlUrl;
  document.getElementById('issue-id').value = data.id;
  document.getElementById('issue-title').value = data.title;
  document.getElementById('xmlLink').href = data.xmlUrl;
}

function printSingleCard() {
  var obj = {"singleCard": document.getElementById('xmlUrl').value};
  chrome.storage.local.set(obj, function(result) {
    openPrintTab();
  });
}

function addCard() {
  chrome.storage.local.get("cards", function(result) {
    var cards = new Array();
    if (result.cards) {
      cards = result.cards;
    }
    cards = addDataToArray(cards);
    var obj = {"cards": cards};
    chrome.storage.local.set(obj);
    refreshSavedCards();
  });
}

function removeCard(cardID) {
  chrome.storage.local.get("cards", function(result) {
    var cards = new Array();
    if (result.cards) {
      cards = result.cards;
    }
    for (var i=0; i<cards.length; i++) {
      if (card[i].id == cardID) {
        cards.splice(i, 1);
        break;
      }
    }
    var obj = {"cards": cards};
    chrome.storage.local.set(obj);
    refreshSavedCards();
  });
}

function printCards() {
  openPrintTab();
}

function emptyCards() {
  chrome.storage.local.remove("cards", function(result) {
    refreshSavedCards();
  });
}

function refreshSavedCards() {
  chrome.storage.local.get("cards", function(result) {
    if (result.cards) {
      document.getElementById('saved-cards').style.display='block';
      document.getElementById('cards-list').innerHTML = '';
      for (var i=0; i<result.cards.length; i++) {
        var li = document.createElement('li');
        li.innerHTML = "<b>" + result.cards[i].id + "</b> " + result.cards[i].title;
        document.getElementById('cards-list').appendChild(li);
      }
    } else {
      document.getElementById('saved-cards').style.display='none';
    }
  });
}

function openPrintTab() {
  chrome.tabs.create({url: "cards.html"});
}

function addDataToArray(cards) {
  var found = false;
  for (var i=0; i<cards.length; i++) {
    if (cards[i].xmlUrl === document.getElementById('xmlUrl').value) {
      found = true;
    }
  }
  if (!found) {
    var obj = {};
    obj["id"] = document.getElementById('issue-id').value;
    obj["title"] = document.getElementById('issue-title').value;
    obj["xmlUrl"] = document.getElementById('xmlUrl').value;
    cards.push(obj);
  }
  return cards;
}