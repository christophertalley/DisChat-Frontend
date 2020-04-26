
const addChannel = document.querySelector(".add-channel");
const channelList = document.querySelector(".display-channels");
const formChannel = document.querySelector(".create-channel");
const channelInput = document.getElementById('newChannel');


socket.on('add channel', (addedChannel) => {
    let channel = document.createElement("li");


    channel.classList.add("channels-li");
    channel.innerHTML = `<p class="select-channel"> # ${addedChannel.channelName}</p>`;
    channelList.prepend(channel);
    textInputBox.classList.remove("hidden");
    textInputBox.classList.add("new-message-form");

    channelInput.value = '';

    channel.dataset.channelId = addedChannel.id;
    channel.dataset.channelName = addedChannel.channelName;


    channel.addEventListener('click', async (e) => {
        socket.emit('leave channel', `${currentChannelId}`);
        currentChannelId = e.currentTarget.dataset.channelId;
        socket.emit('join channel', `${currentChannelId}`);
        const currentChannelName = e.currentTarget.dataset.channelName;
        channelTitle.innerHTML = currentChannelName;
        messageBox.innerHTML = '';
        const messageRes = await fetch(`${api}channels/${currentChannelId}/messages`);
        const parsedMessageRes = await messageRes.json();
        const messages = parsedMessageRes.messages;
        messages.forEach(message => {
            messageBox.innerHTML += `<p class="messages">${message.User.userName}: <br/> ${message.messageContent}</p>`;
        });
    })
})



addChannel.addEventListener("click", async (e) => {
    e.preventDefault();
    formChannel.classList.toggle("hidden");
    channelInput.focus();
    channelInput.value = "";
})


formChannel.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formChannel);

    const channelName = formData.get("channelName");

    formChannel.classList.add("hidden");

    const body = { channelName };

    channelInput.value = '';

    try {

        const res = await fetch(`${api}servers/${serverId}/channels`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": 'application/json',
            }
        });
        if (!res.ok) {
            throw res;
        }

        const parsedRes = await res.json();

        const newChannel = parsedRes.channel;

        socket.emit('add channel', newChannel);

    } catch (e) {
        console.error(e)
    }


});
