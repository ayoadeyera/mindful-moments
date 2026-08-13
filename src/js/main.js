// App entry point: renders each view (Today, Sanctuary, History) into
// #view-container and wires up navigation between them.

import '../css/style.css'
import { renderMoodPicker } from './mood.js'
import { getQuote } from './quote.js'
import { getImage, triggerDownload } from './visual.js'
import { saveFavorite, getFavorites, removeFavorite, getMoodLog, logMood, getStreak, getLastMood, setLastMood } from './storage.js'
import { getWeekDays, formatDateKey, summarizeWeek, MOOD_COLORS } from './history.js'
import { applyMoodTheme } from './theme.js'

// Renders the mood picker and, once a mood is selected, the quote/image result.
function renderToday(container) {
  container.innerHTML = `
    <h1>How are you feeling today?</h1>
    <div id="mood-picker" class="mood-picker"></div>
    <div id="today-result"></div>
  `

  const pickerEl = container.querySelector('#mood-picker')
  renderMoodPicker(pickerEl, async (mood) => {
    logMood(mood)
    setLastMood(mood)
    applyMoodTheme(mood)
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
        mood,
        quote: quote.content,
        author: quote.author,
        imageUrl: image ? image.url : null,
        imageAlt: image ? image.altText : null,
        photographerName: image ? image.photographerName : null,
        photographerLink: image ? image.photographerLink : null,
      })
      saveBtn.textContent = '♥ Saved'
      saveBtn.disabled = true
    })
  })
}

// Renders saved favorites, or an empty-state prompt if none exist yet.
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
        ? `<img src="${favorite.imageUrl}" alt="${favorite.imageAlt || ''}" class="sanctuary-image" />`
        : '<div class="sanctuary-image-placeholder"></div>'

      const creditHtml = favorite.photographerName
        ? `<p class="sanctuary-credit">Photo by <a href="${favorite.photographerLink}" target="_blank" rel="noopener">${favorite.photographerName}</a></p>`
        : ''

      return `
        <div class="sanctuary-card">
          ${imageHtml}
          <p class="sanctuary-quote">${favorite.quote}</p>
          ${creditHtml}
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

// Renders the 7-day mood dashboard, or an empty-state prompt if no check-ins exist yet.
function renderHistory(container) {
  const log = getMoodLog()
  const streak = getStreak()

  if (Object.keys(log).length === 0) {
    container.innerHTML = `
      <div class="history-header">
        <h1>Mood history</h1>
        <span class="streak-chip">Start your streak</span>
      </div>
      <div class="empty-state">
        <div class="empty-icon">\u25A4</div>
        <h2>Your week will show up here</h2>
        <p>Check in once a day and we'll start tracking your patterns.</p>
        <button class="empty-cta" type="button">Check in now</button>
      </div>
    `
    container.querySelector('.empty-cta').addEventListener('click', () => showView('today'))
    return
  }

  const days = getWeekDays()
  const todayKey = formatDateKey(new Date())

  const dotsHtml = days
    .map(({ dateKey, label }) => {
      const mood = log[dateKey]
      let dotClass = 'day-dot'
      let inlineStyle = ''

      if (mood) {
        // Active logged mood gets its background color
        inlineStyle = `background-color: ${MOOD_COLORS[mood] || '#ccc'};`
      } else if (dateKey < todayKey) {
        dotClass += ' missed'
      } else if (dateKey > todayKey) {
        dotClass += ' upcoming'
      }

      if (dateKey === todayKey) {
        dotClass += ' today-ring'
      }

      return `
        <div class="day-column">
          <div class="${dotClass}" style="${inlineStyle}"></div>
          <span class="day-label">${label}</span>
        </div>
      `
    })
    .join('')

  container.innerHTML = `
    <div class="history-header">
      <h1>Mood history</h1>
      <span class="streak-chip">${streak}-day streak</span>
    </div>
    <div class="history-card">
      <div class="day-row">${dotsHtml}</div>
      <p class="week-caption">${summarizeWeek(days, log)}</p>
    </div>
  `
}

const views = {
  today: renderToday,
  sanctuary: renderSanctuary,
  history: renderHistory,
}

const viewContainer = document.querySelector('#view-container')
const navButtons = document.querySelectorAll('.nav-item')

// Renders the given view and updates which nav button is marked active.
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

// Restore the accent color from the last visit, before the first render.
const lastMood = getLastMood()
if (lastMood) {
  applyMoodTheme(lastMood)
}

// Keyboard shortcuts: 1/2/3 switch between Today, Sanctuary, and History.
document.addEventListener('keydown', (event) => {
  const shortcuts = { '1': 'today', '2': 'sanctuary', '3': 'history' }
  if (shortcuts[event.key]) {
    showView(shortcuts[event.key])
  }
})

showView('today')