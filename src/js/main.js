import '../css/style.css'
import { renderMoodPicker } from './mood.js'
import { getQuote } from './quote.js'
import { getImage, triggerDownload } from './visual.js'
import { saveFavorite, getFavorites, removeFavorite } from './storage.js'


function renderToday(container) {
  container.innerHTML = `
    <h1>How are you feeling today?</h1>
    <div id="mood-picker" class="mood-picker"></div>
    <div id="today-result"></div>
  `

  const pickerEl = container.querySelector('#mood-picker')
  renderMoodPicker(pickerEl, async (mood) => {
    const resultEl = container.querySelector('#today-result')
    resultEl.innerHTML = '<p class="loading">Finding something for you...</p>'

    const [quote, image] = await Promise.all([getQuote(mood), getImage(mood)])

    const imageHtml = image
      ? `<img src="${image.url}" alt="${image.altText}" class="result-image" />`
      : '<div class="result-image-placeholder"></div>'

    const attributionHtml = image
      ? `<p class="photo-credit">Photo by <a href="${image.photographerLink}" target="_blank" rel="noopener">${image.photographerName}</a> on <a href="${image.unsplashLink}" target="_blank" rel="noopener">Unsplash</a></p>`
      : ''

    resultEl.innerHTML = `
      <div class="result-card">
        ${imageHtml}
        <blockquote>"${quote.content}"</blockquote>
        <p class="quote-author">— ${quote.author}</p>
        ${attributionHtml}
        <button class="save-btn" type="button">♡ Save to sanctuary</button>
      </div>
    `

    if (image) {
      triggerDownload(image.downloadLocation)
    }

    const saveBtn = resultEl.querySelector('.save-btn')
    saveBtn.addEventListener('click', () => {
      saveFavorite({
        quote: quote.content,
        author: quote.author,
        imageUrl: image ? image.url : null,
      })
      saveBtn.textContent = '♥ Saved'
      saveBtn.disabled = true
    })
  })
}

function renderSanctuary(container) {
  const favorites = getFavorites()

  if (favorites.length === 0) {
    container.innerHTML = `
      <h1>My sanctuary</h1>
      <div class="empty-state">
        <div class="empty-icon">♡</div>
        <h2>Save your favorite moments</h2>
        <p>Tap the heart on any quote or image from Today to add it here.</p>
        <button class="empty-cta" type="button">Go to Today</button>
      </div>
    `
    container.querySelector('.empty-cta').addEventListener('click', () => {
      showView('today')
    })
    return
  }

  const cardsHtml = favorites
    .map((favorite) => {
      const imageHtml = favorite.imageUrl
        ? `<img src="${favorite.imageUrl}" alt="" class="sanctuary-image" />`
        : '<div class="sanctuary-image-placeholder"></div>'

      return `
        <div class="sanctuary-card">
          ${imageHtml}
          <p class="sanctuary-quote">${favorite.quote}</p>
          <button class="remove-btn" type="button" data-id="${favorite.id}">♥</button>
        </div>
      `
    })
    .join('')

  container.innerHTML = `
    <h1>My sanctuary</h1>
    <div class="sanctuary-grid">${cardsHtml}</div>
  `

  container.querySelectorAll('.remove-btn').forEach((button) => {
    button.addEventListener('click', () => {
      removeFavorite(Number(button.dataset.id))
      renderSanctuary(container)
    })
  })
}
function renderHistory(container) {
  container.innerHTML = '<h1>Mood history</h1><p>7-day view goes here.</p>'
}

const views = {
  today: renderToday,
  sanctuary: renderSanctuary,
  history: renderHistory,
}

const viewContainer = document.querySelector('#view-container')
const navButtons = document.querySelectorAll('.nav-item')

function showView(viewName) {
  views[viewName](viewContainer)

  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.view === viewName)
  })
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showView(button.dataset.view)
  })
})

showView('today')