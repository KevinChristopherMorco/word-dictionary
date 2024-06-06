import { toggleClass } from "./events.js"

export const setStorageItem = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data))
}

export const handleStorage = (e, items) => {
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