

const setFont = (fonts) => {
    const fontValue = `"${fonts['--font-theme'].split(',')[0]}",${fonts['--font-theme'].split(',')[1]}`
    Object.entries(fonts).forEach(font => {
        document.documentElement.style.setProperty(font[0], fontValue)
    })
}

const fetchFont = (e) => {
    fetchJSON(e, '../json/fonts.json', [handleChangeFont])
}

const setTheme = (themes) => {
    Object.entries(themes).forEach(theme => {
        document.documentElement.style.setProperty(theme[0], theme[1])
    })
}

const fetchTheme = (e) => {
    fetchJSON(e, '../json/theme.json', [handleSliderToggle])
}
