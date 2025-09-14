addEventListener('keydown', (event) => {
    if(event.key === ";") {
        document.querySelector('.terminal-window').classList.toggle('intro');
    }
});