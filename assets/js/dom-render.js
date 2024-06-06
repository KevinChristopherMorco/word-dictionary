import { fetchAPI } from "./api.js"
import { wrapper,speechTemplate, speechHeader} from './dom-elements.js';
import { handleSound } from "./events.js"

export const renderHeader = (data, i) => {
    const header = speechHeader.content.cloneNode(true)
    if (i === 0) {
        header.querySelector('.dictionary__header .dictionary__word .word__spell').textContent = data.word
        header.querySelector('.dictionary__header .dictionary__word .word__phonetics').textContent = data.phonetic

        wrapper.appendChild(header)
    }
}

export const renderDefinitions = (data, speechNode) => {
    data.definitions.forEach(definition => {
        const mainList = speechNode.querySelector('.dictionary__definition .word__meaning .word__meaning-list')
        const listItem = document.createElement('li')
        listItem.classList.add('list__item')
        listItem.textContent = definition.definition
        mainList.appendChild(listItem)
    })
}

export const renderSynonyms = (synonyms, speechNode) => {
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

export const renderAntonyms = (antonyms, speechNode) => {
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

export const partOfSpeech = (meaning, speechNode) => {
    speechNode.querySelector('.word__type').textContent = meaning.partOfSpeech
}

export const wordSources = (data, speechNode) => {
    speechNode.querySelector('.word__redirect').textContent = data.sourceUrls
    speechNode.querySelector('.word__redirect').setAttribute('href', data.sourceUrls)
    speechNode.querySelector('.word__redirect').setAttribute('target', '__blank')
}

export const renderMeaning = (data, meaning) => {
    const speechNode = speechTemplate.content.cloneNode(true)
    renderDefinitions(meaning, speechNode)
    renderSynonyms(meaning.synonyms, speechNode)
    renderAntonyms(meaning.antonyms, speechNode)
    partOfSpeech(meaning, speechNode)
    wordSources(data, speechNode)

    wrapper.appendChild(speechNode)
}

export const renderData = (wordInfo) => {
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



