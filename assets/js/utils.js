import { fetchJSON } from "./api.js"
import { handleSliderToggle } from "./events.js"

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


export const setFont = (fonts) => {
    const fontValue = `"${fonts['--font-theme'].split(',')[0]}",${fonts['--font-theme'].split(',')[1]}`
    Object.entries(fonts).forEach(font => {
        document.documentElement.style.setProperty(font[0], fontValue)
    })
}

export const fetchFont = (e) => {
    fetchJSON(e, '../json/fonts.json', [handleChangeFont])
}

export const setTheme = (themes) => {
    Object.entries(themes).forEach(theme => {
        document.documentElement.style.setProperty(theme[0], theme[1])
    })
}

export const fetchTheme = (e) => {
    fetchJSON(e, '../json/theme.json', [handleSliderToggle])
}

export const setURL = (word) => {
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
