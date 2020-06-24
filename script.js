const URL = 'https://discordapp.com/api/webhooks/723178666426892318/TAggXYkWjvg5qGvJpxv9zbwDKdQg1keiidnAhNy5uC0C7rgufgQ8RvDXtnXIFFTBk9pB'


function initialize() {
    const urlInput = document.getElementById('webhook-url')
    const url = localStorage.getItem('webhook-url')


    if (url) {
        urlInput.value = url
        enableSendButton()
    } else {
        toggleConfigMenu()
    }
}

function saveUrl() {
    const url = document.getElementById('webhook-url').value
    localStorage.setItem('webhook-url', url)
    toggleConfigMenu()
}

function removeAnnouncement(id) {
    const form = document.querySelector('form')
    const fieldset = document.getElementById(id)
    form.removeChild(fieldset)

    if (!form.childElementCount) {
        disableSendButton()
    }
}

function newAnnouncement() {
    const form = document.querySelector('form')
    const fieldset = document.createElement('fieldset')
    const uniqueId = new Date().getTime()
    fieldset.id = uniqueId
    fieldset.innerHTML = `
    <div>
        <div class="remove_button-container">
            <button class="remove" type="button" onclick="removeAnnouncement(${uniqueId})">
                <svg height="16" width="16" viewBox="0 0 365.696 365.696"
                    xmlns="http://www.w3.org/2000/svg">
                    <path class="cross"
                        d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0" />
                </svg>
            </button>
        </div>
        <section class="announcement">
            <div>
                <input type="color" autocomplete="off" name="color">
            </div>
            <div class="p-3">
                <input type="text" class="title" autocomplete="off" name="title" placeholder="Title">
                <textarea name="description" autocomplete="off" cols="30" rows="5" class="description"
                    placeholder="description"></textarea>
            </div>
        </section>
    </div>
    `
    const clone = fieldset.cloneNode(true)

    form.appendChild(clone)
    enableSendButton()
}

function handleSubimit() {

    const sendIcon = document.getElementById('send_icon')
    const username = document.getElementById('username').value
    const fieldsets = document.querySelectorAll('fieldset')
    const elements = Object.values(fieldsets)

    sendIcon.classList.add('sended')

    const hexToDecimal = (hexColor) => {
        const sanitized = hexColor.substring(1, hexColor.length)
        return parseInt(sanitized, 16)
    }

    const content = elements.map(element => {
        const fieldset = Object.values(element.elements)
        return fieldset.reduce((data, item) => {
            return {
                ...data,
                [item.name]: item.name == 'color' ? hexToDecimal(item.value) : item.value
            }
        }, {})
    });
    sendMessage(username, content)
}

function toggleConfigMenu() {
    const button = document.getElementById('config-button')
    const configArea = document.getElementById('config-content')

    button.classList.toggle('close')
    button.classList.toggle('open')

    configArea.classList.toggle('opened')

    if (!configArea.classList.contains('opened')) {
        configArea.classList.add('closed')
    } else {
        configArea.classList.remove('closed')
    }
}

function sendMessage(username, embeds) {
    const headers = new Headers({ "Content-Type": "application/json" })

    const body = {
        username,
        embeds
    }

    fetch(localStorage.getItem('webhook-url'), {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(() => {
            const sendIcon = document.getElementById('send_icon')
            sendIcon.classList.remove('sended')
        })
}

function enableSendButton() {
    const sendButton = document.getElementById('send')
    const form = document.querySelector('form')

    if (!!form.childElementCount && localStorage.getItem('webhook-url')) {
        sendButton.removeAttribute('disabled')
    }
}


function disableSendButton() {
    const sendButton = document.getElementById('send')
    sendButton.setAttribute('disabled', '')
}