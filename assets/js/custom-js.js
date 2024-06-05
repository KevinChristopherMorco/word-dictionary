const sendBtn = document.querySelector('.search__wrapper > button')
const wrapper = document.querySelector('.dictionary__wrapper')
const speechTemplate = document.querySelector('#speech__wrapper')
const speechHeader = document.querySelector('#speech__header')
const dailyWord = document.querySelector('#daily__word-template')

const renderHeader = (data, i) => {
    const header = speechHeader.content.cloneNode(true)
    if (i === 0) {
        header.querySelector('.dictionary__header .dictionary__word .word__spell').textContent = data.word
        header.querySelector('.dictionary__header .dictionary__word .word__phonetics').textContent = data.phonetic

        wrapper.appendChild(header)
    }
}

const renderDefinitions = (data, speechNode) => {
    data.definitions.forEach(definition => {
        const mainList = speechNode.querySelector('.dictionary__definition .word__meaning .word__meaning-list')
        const listItem = document.createElement('li')
        listItem.classList.add('list__item')
        listItem.textContent = definition.definition
        mainList.appendChild(listItem)
    })
}

const renderSynonyms = (synonyms, speechNode) => {
    if (synonyms.length === 0) {
        speechNode.querySelector('.dictionary__definition .word__semantics .word__synonym').remove()
        return;
    }

    const mainList = speechNode.querySelector('.dictionary__definition .word__semantics .word__synonym > span')
    synonyms.forEach(synonym => {
        const listItem = document.createElement('a')
        listItem.textContent = synonym
        listItem.setAttribute('href', `#${listItem.textContent}`)
        listItem.addEventListener('click', (e) => fetchAPI(e.target.textContent, [renderData, handleSound]))
        mainList.appendChild(listItem)
    })
    speechNode.querySelector('.dictionary__definition .word__semantics .word__synonym > p').textContent = 'Synonyms:'
}

const renderAntonyms = (antonyms, speechNode) => {
    if (antonyms.length === 0) {
        speechNode.querySelector('.dictionary__definition .word__semantics .word__antonym').remove()
        return;
    }

    const mainList = speechNode.querySelector('.dictionary__definition .word__semantics .word__antonym > span')
    antonyms.forEach(antonym => {
        const listItem = document.createElement('a')
        listItem.textContent = antonym
        listItem.setAttribute('href', `#${listItem.textContent}`)
        listItem.addEventListener('click', (e) => fetchAPI(e.target.textContent, [renderData, handleSound]))
        mainList.appendChild(listItem)
    })
    speechNode.querySelector('.dictionary__definition .word__semantics .word__antonym > p').textContent = 'antonyms:'
}

const partOfSpeech = (meaning, speechNode) => {
    speechNode.querySelector('.word__type').textContent = meaning.partOfSpeech
}

const wordSources = (data, speechNode) => {
    speechNode.querySelector('.word__redirect').textContent = data.sourceUrls
    speechNode.querySelector('.word__redirect').setAttribute('href', data.sourceUrls)
    speechNode.querySelector('.word__redirect').setAttribute('target', '__blank')
}

const renderMeaning = (data, meaning) => {
    const speechNode = speechTemplate.content.cloneNode(true)
    renderDefinitions(meaning, speechNode)
    renderSynonyms(meaning.synonyms, speechNode)
    renderAntonyms(meaning.antonyms, speechNode)
    partOfSpeech(meaning, speechNode)
    wordSources(data, speechNode)

    wrapper.appendChild(speechNode)
}

const renderData = (wordInfo) => {
    reset()
    wordInfo.forEach((data, i) => {
        renderHeader(data, i)
        data.meanings.forEach(meaning => renderMeaning(data, meaning))
    });
}

const reset = () => {
    const definitions = wrapper.querySelectorAll('.dictionary__definition')
    const headers = wrapper.querySelectorAll('.dictionary__header')

    definitions.forEach(definition => {
        definition.remove()
    })

    headers.forEach(header => {
        header.remove()
    })
}

const fetchAPI = async (word, functions) => {
    const errorTemplate = document.querySelector('#error')
    const errorNode = errorTemplate.content.cloneNode(true)
    wrapper.querySelector('.daily__word')?.remove()
    await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (response.status === 404) {
                [...wrapper.children].forEach(x=> {
                    x.remove()
                })
                wrapper.appendChild(errorNode)
                throw new Error('Word is not available in our system')
                return;
            }

            wrapper.querySelector('.error__container')?.remove();
            return response.json()
        })
        .then(data => {
            if (functions != null) {
                functions.forEach(func => {
                    func(data)
                })
            }
        })
        .catch(error => {
            console.error(error)
        })
}

const fetchJSON = (e, json, functions) => {
    fetch(json)
        .then(response => response.json())
        .then(data => functions.forEach(func => {
            func(e, data)
        }))
        .catch(error => {
            console.error(error)
        })
}

const handleWordSearch = async () => {
    let wordInput = document.querySelector('.search__wrapper > input').value
    const dailyWord = wrapper.querySelector('.daily__word')
    if (dailyWord) {
        dailyWord.remove()
    }

    if (wordInput === '') return;

    setURL(wordInput)
    const loader = document.querySelector('.loader')
    await fetchAPI(wordInput, [renderData, handleSound])
}

sendBtn.addEventListener('click', handleWordSearch)

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

const wordOfTheDay = (wordInfo) => {
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
const setFont = (fonts) => {
    const fontValue = `"${fonts['--font-theme'].split(',')[0]}",${fonts['--font-theme'].split(',')[1]}`
    Object.entries(fonts).forEach(font => {
        document.documentElement.style.setProperty(font[0], fontValue)
    })
}
const fetchFont = (e) => {
    fetchJSON(e, '../json/fonts.json', [handleChangeFont])
}

drop.addEventListener('change', (e) => fetchFont(e))

const mode = document.querySelector('.theme__mode')
const toggle = document.querySelector('.theme__toggle')
const icon = document.querySelector('.theme__icon')


const fetchTheme = (e) => {
    fetchJSON(e, '../json/theme.json', [handleSliderToggle])
}

const toggleClass = () => {
    mode.classList.toggle('theme__mode--active')
    toggle.classList.toggle('theme__toggle--active')
}

const setTheme = (themes) => {
    Object.entries(themes).forEach(theme => {
        document.documentElement.style.setProperty(theme[0], theme[1])
    })
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
    console.log(window.location.href.slice(index + 1))
    url = `${url.slice(0, index)}#${window.location.href.slice(index + 1)}`
    fetchAPI(url.slice(index + 1), [renderData, handleSound])

}

window.addEventListener('load', (e) => loadURL(e))

const logo = document.querySelector('.logo__section')

const handleLogoClick = () => {
    window.location.href = '/'
}

logo.addEventListener('click', handleLogoClick)





