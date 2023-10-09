// Function to update the highlighted text in the popup
function updateHighlightedText(text) {
  document.getElementById("highlightedText").innerText = text || "No text highlighted.";
}

// Initial fetch when the popup is opened
// popup.js

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.local.get('highlightedText', function(data) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    updateHighlightedText(data.highlightedText);
  });
});

// Listen for storage changes to update the popup in real-time
chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName === 'local' && 'highlightedText' in changes) {
    updateHighlightedText(changes.highlightedText.newValue);
  }
});


// When either button is clicked, send the text to OpenAI API
document.getElementById('positiveButton').addEventListener('click', () => {
  const text = document.getElementById('highlightedText').innerText;
  sendDataToServer(text, 'positive');
});

document.getElementById('negativeButton').addEventListener('click', () => {
  const text = document.getElementById('highlightedText').innerText;
  sendDataToServer(text, 'negative');
});

// Send data to OpenAI API

// Function to send data to the server
function sendDataToServer(text, type) {
  const url = 'http://localhost:5003/api';
  const payload = {
    text,
    type
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    // add response to the div
    document.getElementById('response').innerText = data.message;
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
