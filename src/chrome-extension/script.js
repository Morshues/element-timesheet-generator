function init() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "runAddDraft") {
      onAddDraft()
    }
  })
}

function onAddDraft() {
  chrome.storage.sync.get(['menu', 'draft'], function(data) {
    if (data.menu?.enabled !== true) {
      return
    }
    let messageDiv = document.querySelector("div[aria-label='Message Body']")
    if (messageDiv == null) {
      alert("email content box not found")
      return
    }
    messageDiv.innerText = data.draft?.text || 'Hi Julia,\n\tThis is a draft\n\nBR,'
  })
}

init()

