
import {fetchAPI, fetchJSON} from './api.js'
// import { wrapper, sendBtn, speechTemplate, speechHeader, dailyWord } from './dom-render.js'
import {renderHeader, renderDefinitions, renderSynonyms, renderAntonyms, partOfSpeech, wordSources, renderMeaning, renderData} from './dom-render.js'
import {handleWordSearch, fetchDailyWord, wordOfTheDay} from './events.js'



// const fetchAPI = async (word, functions) => {
//     const errorTemplate = document.querySelector('#error')
//     const errorNode = errorTemplate.content.cloneNode(true)
//     wrapper.querySelector('.daily__word')?.remove()
//     await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
//         .then(response => {
//             if (response.status === 404) {
//                 [...wrapper.children].forEach(x=> {
//                     x.remove()
//                 })
//                 wrapper.appendChild(errorNode)
//                 throw new Error('Word is not available in our system')
//                 return;
//             }

//             wrapper.querySelector('.error__container')?.remove();
//             return response.json()
//         })
//         .then(data => {
//             if (functions != null) {
//                 functions.forEach(func => {
//                     func(data)
//                 })
//             }
//         })
//         .catch(error => {
//             console.error(error)
//         })
// }

// const fetchJSON = (e, json, functions) => {
//     fetch(json)
//         .then(response => response.json())
//         .then(data => functions.forEach(func => {
//             func(e, data)
//         }))
//         .catch(error => {
//             console.error(error)
//         })
// }


const drop = document.querySelector('.theme__font-dropdown > select')

const handleChangeFont = (e, fonts) => {
    switch (e.target.value) {
        case 'sans-serif':
            setFont(fonts.inter)
            localStorage.setItem('font', JSON.stringify(fonts.inter))
            localStorage.setItem('fontValue', 'sans-serif')
            break;

        case 'serif':
            setFont(fonts.lora)
            localStorage.setItem('font', JSON.stringify(fonts.lora))
            localStorage.setItem('fontValue', 'serif')
            break;

        case 'mono':
            setFont(fonts.inconsolata)
            localStorage.setItem('font', JSON.stringify(fonts.inconsolata))
            localStorage.setItem('fontValue', 'mono')
            break;
    }
}


const setStorageItem = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data))
}

const handleStorage = (e, items) => {
    const checkToggle = localStorage.getItem('isToggled')
    const checkFontValue = localStorage.getItem('fontValue')

    if (checkFontValue != null) {
        const dropdown = document.querySelector('.theme__font-dropdown > select')
        dropdown.value = checkFontValue
    }

    if (JSON.parse(checkToggle) === true) {
        toggleClass()
    }

    items.forEach(item => {
        const storage = localStorage.getItem(item)
        if (storage === null) return;

        Object.entries(JSON.parse(storage)).forEach(property => {
            document.documentElement.style.setProperty(property[0], property[1])
        })
    })

}

window.addEventListener('load', (e) => handleStorage(e, ['theme', 'font']))

const setURL = (word) => {
    let url = window.location.href
    if (url.indexOf('#') === -1) {
        url = url.concat(`#${word}`)
        window.location.href = url
        return;
    }

    const index = url.indexOf('#')
    url = url.slice(0, index).concat(`#${word}`)
    window.location.href = url


}

const loadURL = (e) => {
    if (!window.location.href.includes('#')) return;
    let url = window.location.href
    const index = url.indexOf('#')
    url = `${url.slice(0, index)}#${window.location.href.slice(index + 1)}`
    fetchAPI(url.slice(index + 1), [renderData, handleSound])

}

window.addEventListener('load', (e) => loadURL(e))

const logo = document.querySelector('.logo__section')

const handleLogoClick = () => {
    window.location.href = '/'
}

logo.addEventListener('click', handleLogoClick)





