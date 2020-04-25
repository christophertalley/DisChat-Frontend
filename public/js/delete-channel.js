const deleteIcon = document.getElementById("delete-icon");

deleteIcon.addEventListener('click', async (e) => {

    socket.emit('leave channel', `${currentChannelId}`);





    const res = await fetch(`http://localhost:8080/channels/${currentChannelId}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw res;
    }

    channelList.innerHTML = '';
    userList.innerHTML = '';
    messageBox.innerHTML = '';
    channelTitle.innerHTML = '';
    // window.location.href = '/home';



    const response = await fetch(`http://localhost:8080/servers/${serverId}/channels`);
    const parsedResponse = await response.json();
    const channels = parsedResponse.channels;

    if (channels.length !== 0) {
        textInputBox.classList.remove("hidden");
        textInputBox.classList.add("new-message-form");
        currentChannelId = channels[0].id;
        socket.emit('join channel', `${currentChannelId}`)

        channels.forEach(channel => {
            let newChannel = document.createElement("li");
            newChannel.dataset.channelId = channel.id;
            newChannel.dataset.channelName = channel.channelName;
            newChannel.classList.add("channels-li");
            newChannel.innerHTML = `<p class="select-channel"> # ${channel.channelName}</p>`;
            channelList.append(newChannel);
            channelTitle.innerHTML = channels[0].channelName;
        })

        const messageRes = await fetch(`http://localhost:8080/channels/${currentChannelId}/messages`);
        const parsedMessageRes = await messageRes.json();
        const messages = parsedMessageRes.messages;
        messageBox.innerHTML = '';
        for (let i = messages.length - 1; i > 0; i--) {
            messageBox.innerHTML += `<p class="messages">${messages[i].User.userName}: <br/> ${messages[i].messageContent}</p>`;
        }
        // messages.forEach(message => {
        //     messageBox.innerHTML += `<p class="messages">${message.User.userName}: <br/> ${message.messageContent}</p>`;
        // });
    } else {
        currentChannelId = '';
    }



    if (channels.length === 0) {
        channelTitle.innerHTML = "";
        textInputBox.classList.add("hidden");
        textInputBox.classList.remove("new-message-form");
    }


    displayedChannels = document.querySelectorAll('.channels-li');

    displayedChannels.forEach(channel => {
        channel.addEventListener('click', async (e) => {

            socket.emit('leave channel', `${currentChannelId}`);
            currentChannelId = e.currentTarget.dataset.channelId;
            socket.emit('join channel', `${currentChannelId}`)
            const currentChannelName = e.currentTarget.dataset.channelName;

            messageBox.innerHTML = '';
            channelTitle.innerHTML = currentChannelName;
            // fetch call with channelid to get messages
            const messageRes = await fetch(`http://localhost:8080/channels/${currentChannelId}/messages`);
            const parsedMessageRes = await messageRes.json();

            const messages = parsedMessageRes.messages;
            for (let i = messages.length - 1; i > 0; i--) {
                messageBox.innerHTML += `<p class="messages">${messages[i].User.userName}: <br/> ${messages[i].messageContent}</p>`;
            }
            // messages.forEach(message => {
            //     messageBox.innerHTML += `<p class="messages">${message.User.userName}: <br/> ${message.messageContent}</p>`;
            // });
        })
    })

    // console.log(e);



})


