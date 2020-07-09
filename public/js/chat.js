// import { api } from './utils.js';
// const api = document.querySelector('link[rel="api"]').href;
const socket = io();

const sendButton = document.querySelector('.message-submit');
const chatInput = document.getElementById('new-message');
const messageBox = document.querySelector('.message');


const userId = localStorage.getItem("DischatUserId");
const user = localStorage.getItem('DischatUserName');

sendButton.addEventListener('click', async e => {
    e.preventDefault();

    if (chatInput.value === '') {
        return;
    }

    // Emits message to front end server
    socket.emit('message', {
        messageContent: chatInput.value,
        UserId: userId,
        ChatId: currentChannelId,
        username: user
    })
    let chat = chatInput.value;
    chatInput.value = '';
    try {
        const res = await fetch(`${api}channels/${currentChannelId}/messages`, {
            method: 'POST',
            body: JSON.stringify({
                messageContent: chat,
                UserId: userId,
                ChatId: currentChannelId
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        });

        if (!res.ok) {
            throw res;
        }
    } catch (e) {
        console.error(e);
    }

})

// Receives messages from front end server
socket.on('message', async (msgObj) => {
    const messageDiv = document.createElement('div');
    messageDiv.id = msgObj.messageContent;
    messageDiv.innerHTML = `<p class="messages"> ${msgObj.username}: <br/> ${msgObj.messageContent} </p>`;
    // if (msgObj.ChatId === currentChannelId) {
    messageBox.prepend(messageDiv);
    // }

});




