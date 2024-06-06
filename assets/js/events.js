import { wrapper, sendBtn, dailyWord,logo,drop } from "./dom-elements.js"
import { fetchAPI } from './api.js'
import { renderData } from "./dom-render.js"
import { setURL,setTheme, fetchTheme, fetchFont } from "./utils.js"
import { setStorageItem } from "./localstorage.js"

export const handleWordSearch = async () => {
    let wordInput = document.querySelector('.search__wrapper > input').value
    const dailyWordText = wrapper.querySelector('.daily__word')
    if (dailyWordText) {
        dailyWordText.remove()
    }

    if (wordInput === '') return;

    setURL(wordInput)
    await fetchAPI(wordInput, [renderData, handleSound])
}

sendBtn.addEventListener('click', handleWordSearch)

export const fetchDailyWord = () => {
    const wordsOfTheDay = [
        "Joy",
        "Courage",
        "Hope",
        "Love",
        "Peace",
        "Friend",
        "Trust",
        "Laugh",
        "Dream",
        "Smile"
    ];

    let date = new Date()
    const index = date.getDate() % wordsOfTheDay.length
    const word = wordsOfTheDay[index];

    fetchAPI(word, [wordOfTheDay, handleSound])
}

export const wordOfTheDay = (wordInfo) => {
    const dailyWordTemplate = dailyWord.content.cloneNode(true)
    wrapper.appendChild(dailyWordTemplate)
    const dailyWordText = wrapper.querySelector('.daily__word')

    if(window.location.href.includes('#')){
        dailyWordText.remove()
    }
    renderData(wordInfo)
}

window.addEventListener('load', fetchDailyWord)

let handleSoundClick
export const handleSound = (sounds) => {
    const wordPronounce = wrapper.querySelector('.dictionary__pronounce')

    if (handleSoundClick) {
        wordPronounce.removeEventListener('click', handleSoundClick)
    }

    handleSoundClick = (e) => {
        let rawAudio
        sounds.forEach(sound => {
            sound.phonetics.forEach(phonetic => {
                const phonetics = phonetic.audio
                if (phonetics != '') {
                    rawAudio = phonetics
                }
            })
        })
        const audio = new Audio(rawAudio)
        audio.play()
    }
    wordPronounce.addEventListener('click', handleSoundClick)
}

drop.addEventListener('change', (e) => fetchFont(e))


const mode = document.querySelector('.theme__mode')
const toggle = document.querySelector('.theme__toggle')
const icon = document.querySelector('.theme__icon')

export const toggleClass = () => {
    mode.classList.toggle('theme__mode--active')
    toggle.classList.toggle('theme__toggle--active')
}

export const handleSliderToggle = (e, themes) => {
    if (mode.classList.contains('theme__mode--active')) {
        setTheme(themes.lightTheme)
        setStorageItem('theme', themes.lightTheme)
        setStorageItem('isToggled', false)
    } else {
        setTheme(themes.darkTheme)
        setStorageItem('theme', themes.darkTheme)
        setStorageItem('isToggled', true)
    }
    toggleClass()
}

mode.addEventListener('click', (e) => fetchTheme(e))
icon.addEventListener('click', (e) => fetchTheme(e))

const loadURL = (e) => {
    if (!window.location.href.includes('#')) return;
    let url = window.location.href
    const index = url.indexOf('#')
    url = `${url.slice(0, index)}#${window.location.href.slice(index + 1)}`
    fetchAPI(url.slice(index + 1), [renderData, handleSound])

}

window.addEventListener('load', (e) => loadURL(e))

const handleLogoClick = () => {
    window.location.href = '/'
}

logo.addEventListener('click', handleLogoClick)



