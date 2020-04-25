const addChannel = document.querySelector(".add-channel");
const channelList = document.querySelector(".display-channels");
const formChannel = document.querySelector(".create-channel");
// const buttonNewChannel = document.querySelector(".submit");
const channelInput = document.getElementById('newChannel');
// const serverList = document.querySelector("server-list");



addChannel.addEventListener("click", async (e) => {
    e.preventDefault();
    formChannel.classList.toggle("hidden");
})


formChannel.addEventListener("submit", async (e) => {
    const channelTitle = document.getElementById('channel-name');
    e.preventDefault();

    const formData = new FormData(formChannel);

    const channelName = formData.get("channelName");

    // Commented this line out because we never used userId here
    // const userId = localStorage.getItem("DischatUserId");

    let channel = document.createElement("li");


    const body = { channelName };

    channelInput.value = '';

    try {

        const res = await fetch(`http://localhost:8080/servers/${serverId}/channels`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": 'application/json',
            }
        });
        if (!res.ok) {
            throw res;
        }
        messageBox.innerHTML = '';
        const parsedRes = await res.json();
        socket.emit('leave channel', `${currentChannelId}`);

        const newChannel = parsedRes.channel;
        channel.dataset.channelId = newChannel.id;
        channel.dataset.channelName = newChannel.channelName;

        currentChannelId = newChannel.id;
        socket.emit('join channel', `${currentChannelId}`);


        // let channel = document.createElement("li");

        channel.classList.add("channels-li");
        channel.innerHTML = `<p class="select-channel"> # ${channelName}</p>`;
        channelList.prepend(channel);
        formChannel.classList.add("hidden");
        channelTitle.innerHTML = channelName;
        textInputBox.classList.remove("hidden");
        textInputBox.classList.add("new-message-form");

        channel.addEventListener('click', async (e) => {
            socket.emit('leave channel', `${currentChannelId}`);
            currentChannelId = e.currentTarget.dataset.channelId;
            socket.emit('join channel', `${currentChannelId}`);
            const currentChannelName = e.currentTarget.dataset.channelName;
            channelTitle.innerHTML = currentChannelName;
            messageBox.innerHTML = '';
            const messageRes = await fetch(`http://localhost:8080/channels/${currentChannelId}/messages`);
            const parsedMessageRes = await messageRes.json();
            const messages = parsedMessageRes.messages;
            messages.forEach(message => {
                messageBox.innerHTML += `<p class="messages">${message.User.userName}: <br/> ${message.messageContent}</p>`;
            });
        })




    } catch (e) {
        console.error(e)
    }


});
