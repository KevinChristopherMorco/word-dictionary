import { wrapper, sendBtn, dailyWord, renderData } from "./dom-render.js"
import { fetchAPI } from './api.js'

export const handleWordSearch = async () => {
    let wordInput = document.querySelector('.search__wrapper > input').value
    const dailyWord = wrapper.querySelector('.daily__word')
    if (dailyWord) {
        dailyWord.remove()
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
    const dailyWords = dailyWord.content.cloneNode(true)
    wrapper.appendChild(dailyWords)
    renderData(wordInfo)
}

window.addEventListener('load', fetchDailyWord)

let handleSoundClick
const handleSound = (sounds) => {
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

const drop = document.querySelector('.theme__font-dropdown > select')
drop.addEventListener('change', (e) => fetchFont(e))


const mode = document.querySelector('.theme__mode')
const toggle = document.querySelector('.theme__toggle')
const icon = document.querySelector('.theme__icon')

const toggleClass = () => {
    mode.classList.toggle('theme__mode--active')
    toggle.classList.toggle('theme__toggle--active')
}

const handleSliderToggle = (e, themes) => {
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

