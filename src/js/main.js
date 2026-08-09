import '../css/style.css'
import { renderMoodPicker } from './mood.js'
import { getQuote } from './quote.js'
import { getImage, triggerDownload } from './visual.js'

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
      </div>
    `

    if (image) {
      triggerDownload(image.downloadLocation)
    }
  })
}

function renderSanctuary(container) {
  container.innerHTML = '<h1>My sanctuary</h1><p>Saved favorites go here.</p>'
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