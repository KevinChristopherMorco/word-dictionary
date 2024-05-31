const sendBtn = document.querySelector('.search__wrapper > button')
const renderData = (wordInfo) => {
    reset()
    const wrapper = document.querySelector('.dictionary__wrapper')
    const speechTemplate = document.querySelector('#speech__wrapper')
    const word = wrapper.querySelector('.dictionary__header .dictionary__word .word__spell')
    const phonetic = wrapper.querySelector('.dictionary__header .dictionary__word .word__phonetics')

    wordInfo.forEach((data, i) => {
        if (i === 0) {
            word.textContent = data.word
            phonetic.textContent = data.phonetic
        }

        data.meanings.forEach(meaning => {
            const speechNode = speechTemplate.content.cloneNode(true)
            speechNode.querySelector('.word__type').textContent = meaning.partOfSpeech
            speechNode.querySelector('.word__redirect').textContent = data.sourceUrls

            meaning.definitions.forEach(definition => {
                const mainList = speechNode.querySelector('.dictionary__definition .word__meaning .word__meaning-list')
                const listItem = document.createElement('li')
                listItem.classList.add('list__item')
                listItem.textContent = definition.definition
                mainList.appendChild(listItem)
            })

            if (meaning.synonyms.length != 0) {
                meaning.synonyms.forEach(synonym => {
                    const mainList = speechNode.querySelector('.dictionary__definition .word__semantics .word__synonym > span')
                    const listItem = document.createElement('a')
                    listItem.textContent = synonym
                    mainList.appendChild(listItem)
                })
                speechNode.querySelector('.dictionary__definition .word__semantics .word__synonym > p').textContent = 'Synonyms:'
            } else {
                speechNode.querySelector('.dictionary__definition .word__semantics .word__synonym').remove()
            }

            if (meaning.synonyms.length != 0) {
                meaning.antonyms.forEach(antonym => {
                    const mainList = speechNode.querySelector('.dictionary__definition .word__semantics .word__antonym > span')
                    const listItem = document.createElement('a')
                    listItem.textContent = antonym
                    mainList.appendChild(listItem)
                })
                speechNode.querySelector('.dictionary__definition .word__semantics .word__antonym > p').textContent = 'Antonyms:'
            } else {
                speechNode.querySelector('.dictionary__definition .word__semantics .word__antonym').remove()
            }
            wrapper.appendChild(speechNode)
        })
    });
}

const reset = () => {
    const definitions = document.querySelectorAll('.dictionary__definition')
    definitions.forEach(definition => {
        definition.remove()

    })
}

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

const fetchData = () => {
    let wordInput = document.querySelector('.search__wrapper > input').value
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



