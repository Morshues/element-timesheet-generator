
function onMenuClicked(info, tab) {
  switch (info.menuItemId) {
    case 'add_draft':
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "runAddDraft" })
      })
      break
  }
}

function initMenu() {
  chrome.contextMenus.create({
    id: 'add_draft',
    title: 'Timesheet Helper - Add Draft',
    contexts:['all'],
    documentUrlPatterns: ["https://mail.google.com/*"]
  })

  chrome.contextMenus.onClicked.addListener(onMenuClicked)
}

initMenu()