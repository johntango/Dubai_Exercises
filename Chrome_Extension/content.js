// manage popup location
fetch(chrome.runtime.getURL('popup.html'))
  .then((response) => response.text())
  .then((html) => {
    // Create a new div and inject the popup HTML into it
    const popupDiv = document.createElement('div');
    popupDiv.innerHTML = html;
    popupDiv.style.position = 'fixed';
    popupDiv.style.top = '0';
    popupDiv.style.right = '0';
    popupDiv.style.zIndex = '10000'; // High z-index to make sure it appears above other elements

    // Append the popup div to the body
    document.body.appendChild(popupDiv);
  })
  .catch((error) => {
    console.warn(error);
  });


// Listen for mouseup event to capture highlighted text
document.addEventListener("mouseup", function() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    chrome.runtime.sendMessage({type: "textSelected", text: selectedText}, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log("Received response:", response);
      }
    });
  }
});
