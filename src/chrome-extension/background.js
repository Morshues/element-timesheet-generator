
function onMenuClicked(info, tab) {
  switch (info.menuItemId) {
    case 'add_draft':
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "runAddDraft" })
      })
      break
    case 'download_current':
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "runDownloadCurrent" })
      })
      break
    case 'download_last':
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "runDownloadLast" })
      })
      break
  }
}

function initMenu() {
  const rootBtn = chrome.contextMenus.create({
    id: 'root',
    title: 'Timesheet Helper',
    contexts:['all'],
    documentUrlPatterns: ["https://mail.google.com/*"]
  })

  chrome.contextMenus.create({
    id: 'add_draft',
    title: 'Add Draft',
    contexts:['all'],
    parentId: rootBtn,
  })

  chrome.contextMenus.create({
    id: 'download_current',
    title: 'Download Current Month\'s Timesheet',
    contexts:['all'],
    parentId: rootBtn,
  })

  chrome.contextMenus.create({
    id: 'download_last',
    title: 'Download Last Month\'s Timesheet',
    contexts:['all'],
    parentId: rootBtn,
  })

  chrome.contextMenus.onClicked.addListener(onMenuClicked)
}

initMenu()