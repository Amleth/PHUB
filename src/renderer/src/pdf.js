function setPdf(file, page) {
    if (!page) page = 1
    const pdfUrl = `file://${file}#page=${page}`
    document.getElementById("pdf-viewer").src = file ? pdfUrl : 'https://fr.wikipedia.org/wiki/Canard'
}

export { setPdf }