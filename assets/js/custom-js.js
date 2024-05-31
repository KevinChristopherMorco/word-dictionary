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
        mainList.appendChild(listItem)
    })
    speechNode.querySelector('.dictionary__definition .word__semantics .word__antonym > p').textContent = 'antonyms:'
}

const partOfSpeech = (meaning,speechNode) => {
    speechNode.querySelector('.word__type').textContent = meaning.partOfSpeech
}

const wordSources = (data,speechNode) => {
    speechNode.querySelector('.word__redirect').textContent = data.sourceUrls
}

const renderMeaning = (data,meaning) => {
    const speechNode = speechTemplate.content.cloneNode(true)
    renderDefinitions(meaning, speechNode)
    renderSynonyms(meaning.synonyms, speechNode)
    renderAntonyms(meaning.antonyms, speechNode)
    partOfSpeech(meaning,speechNode)
    wordSources(data,speechNode)

    wrapper.appendChild(speechNode)
}

const renderData = (wordInfo) => {
    reset()
    wordInfo.forEach((data, i) => {
        renderHeader(data, i)
        data.meanings.forEach(meaning => renderMeaning(data,meaning))
    });
}

const reset = () => {
    const definitions = document.querySelectorAll('.dictionary__definition')
    const headers = document.querySelectorAll('.dictionary__header')

    definitions.forEach(definition => {
        definition.remove()
    })

    headers.forEach(header => {
        header.remove()
    })
}

const fetchData = () => {
    let wordInput = document.querySelector('.search__wrapper > input').value
    const dailyWord = wrapper.querySelector('.daily__word')
    if(dailyWord){
        dailyWord.remove()
    }
    if (wordInput === '') return;
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordInput}`)
        .then(response => response.json())
        .then(data => {
            renderData(data)
            handleSound(data)
        })
        .catch(error => {
            console.error(error)
        })
}
sendBtn.addEventListener('click', fetchData)

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

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            wordOfTheDay(data)
            handleSound(data)
        })
        .catch(error => {
            console.error(error)
        })

}

const wordOfTheDay = (wordInfo) => {
    const dailyWords = dailyWord.content.cloneNode(true)
    wrapper.appendChild(dailyWords)
    renderData(wordInfo)
}

window.addEventListener('load', fetchDailyWord)


let handleSoundClick
const handleSound = (sounds) => {
    const wordPronounce = document.querySelector('.dictionary__pronounce')

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



