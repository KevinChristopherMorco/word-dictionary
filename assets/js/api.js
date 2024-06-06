import { wrapper } from "./dom-elements.js"

export const fetchAPI = async (word, functions) => {
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

export const fetchJSON = (e, json, functions) => {
    fetch(json)
        .then(response => response.json())
        .then(data => functions.forEach(func => {
            func(e, data)
        }))
        .catch(error => {
            console.error(error)
        })
}