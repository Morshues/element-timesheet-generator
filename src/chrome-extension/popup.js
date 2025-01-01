document.addEventListener('DOMContentLoaded', function() {
  let enableMenuCheckbox = document.getElementById('enableMenuCheckbox')
  let draftTextarea = document.getElementById('draftTextarea')
  let urlInput = document.getElementById('urlInput')
  let chineseNameInput = document.getElementById('chineseNameInput')
  let englishNameInput = document.getElementById('englishNameInput')
  let supervisorInput = document.getElementById('supervisorInput')
  let positionInput = document.getElementById('positionInput')

  chrome.storage.sync.get(['menu', 'draft', 'profile'], function(data) {
    enableMenuCheckbox.checked = data.menu?.enabled || true
    draftTextarea.value = data.draft?.text || 'Hi Julia,\n\tThis is a draft\n\nBR,'
    urlInput.value = data.profile?.url || ''
    chineseNameInput.value = data.profile?.chinese_name || '陳志明'
    englishNameInput.value = data.profile?.english_name || 'David'
    supervisorInput.value = data.profile?.supervisor || 'Stevens'
    positionInput.value = data.profile?.position || 'Universal Stack Engineer'
  })

  enableMenuCheckbox.addEventListener('change', updateStorage)
  draftTextarea.addEventListener('input', updateStorage)
  urlInput.addEventListener('input', updateStorage)
  chineseNameInput.addEventListener('input', updateStorage)
  englishNameInput.addEventListener('input', updateStorage)
  supervisorInput.addEventListener('input', updateStorage)
  positionInput.addEventListener('input', updateStorage)

  let downloadButton = document.getElementById("downloadButton")
  downloadButton.addEventListener("click", () => {
    const now = new Date()
    const profile = {
      url: urlInput.value,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      chinese_name: chineseNameInput.value,
      english_name: englishNameInput.value,
      supervisor: supervisorInput.value,
      position: positionInput.value,
    }

    download(downloadButton, profile)
  })

  let downloadLastButton = document.getElementById("downloadLastButton")
  downloadLastButton.addEventListener("click", () => {
    const now = new Date()
    const profile = {
      url: urlInput.value,
      year: (now.getMonth() === 0) ? (now.getFullYear() - 1) : now.getFullYear(),
      month: (now.getMonth() === 0) ? 12 : now.getMonth(),
      chinese_name: chineseNameInput.value,
      english_name: englishNameInput.value,
      supervisor: supervisorInput.value,
      position: positionInput.value,
    }

    download(downloadLastButton, profile)
  })
})

function updateStorage() {
  chrome.storage.sync.set({
    menu: { enabled: enableMenuCheckbox.checked },
    draft: { text: draftTextarea.value },
    profile: {
      url: urlInput.value,
      chinese_name: chineseNameInput.value,
      english_name: englishNameInput.value,
      supervisor: supervisorInput.value,
      position: positionInput.value,
    },
  })
}

function download(btn, profile) {
  btn.parentElement.classList.add("downloading")
  fetch(profile.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profile)
  })
    .then(response => response.blob())
    .then(blob => {
      const data = URL.createObjectURL(blob)

      chrome.downloads.download({
        url: data,
        filename: `Work_Record_${profile.year}_${profile.month}_${profile.english_name}.xlsx`,
        saveAs: true
      })
    })
    .catch(error => {
      console.error('Fetching data failed:', error)
    })
    .finally(() => {
      btn.parentElement.classList.remove("downloading")
    })
}