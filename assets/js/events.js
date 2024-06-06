import { wrapper, sendBtn, dailyWord, logo, drop, mode, toggle, icon } from "./dom-elements.js"
import { fetchAPI } from './api.js'
import { renderData } from "./dom-render.js"
import { setURL,setTheme, fetchTheme, fetchFont } from "./utils.js"
import { setStorageItem } from "./localstorage.js"

const handleWordSearch = async () => {
    let wordInput = document.querySelector('.search__wrapper > input').value
    const dailyWordText = wrapper.querySelector('.daily__word')
    if (dailyWordText) {
        dailyWordText.remove()
    }

    if (wordInput === '') return;

    setURL(wordInput)
    await fetchAPI(wordInput, [renderData, handleSound])
}

const fetchDailyWord = () => {
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

const wordOfTheDay = (data) => {
    const dailyWordTemplate = dailyWord.content.cloneNode(true)
    wrapper.appendChild(dailyWordTemplate)

    const dailyWordText = wrapper.querySelector('.daily__word')
    if(window.location.href.includes('#')){
        dailyWordText.remove()
    }
    renderData(data)
}

const handleWord = (e,sounds) => {
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

export const handleSound = (sounds) => {
    const wordPronounce = wrapper.querySelector('.dictionary__pronounce')
    if(!wordPronounce){
        throw new Error('Sound element does not exist')
    }
    wordPronounce.addEventListener('click', (e) => handleWord(e,sounds))
}

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

const loadURL = (e) => {
    if (!window.location.href.includes('#')) return;
    let url = window.location.href
    const index = url.indexOf('#')
    url = `${url.slice(0, index)}#${window.location.href.slice(index + 1)}`
    fetchAPI(url.slice(index + 1), [renderData, handleSound])
}

const handleLogoClick = () => {
    window.location.href = '/'
}

sendBtn.addEventListener('click', handleWordSearch)
mode.addEventListener('click', (e) => fetchTheme(e))
icon.addEventListener('click', (e) => fetchTheme(e))
logo.addEventListener('click', handleLogoClick)
window.addEventListener('load', fetchDailyWord)
window.addEventListener('load', loadURL)
drop.addEventListener('change', (e) => fetchFont(e))






