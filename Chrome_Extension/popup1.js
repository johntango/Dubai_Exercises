chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("listener2 got message: " + JSON.stringify(request.text));
  document.getElementById('text').innerText = request.text;
  sendResponse({text: "response from popup.js"});
  // now post message to the server and get response
});

document.getElementById('text').addEventListener('click', function() {
  let prompt = document.getElementById('text').innerText;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "getSelectedText"}, function(response) {
      let data = {"text": "Write a response email from John :" + prompt};
      fetch('http://localhost:5001/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })
      .then( // this is a JSON object so unpack it
        response => response.json())
      .then((data) => {
        document.getElementById('response').innerText = data.message;
      })
      .catch((error)=>{
        console.log('Error:', error);
      });
  })
  })});
