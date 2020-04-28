
const joinButton = document.querySelector(".server-join-confirm");
const cancelButton = document.querySelector(".server-join-deny");
const joinServerInput = document.getElementById('newJoinServer');
const joinServerForm = document.querySelector(".confirm-join-server");


socket.on('user joins server', (userObject) => {
    const { UserId, username } = userObject;

    let newUser = document.createElement('li');
    newUser.classList.add('users-li');
    newUser.dataset.userId = UserId;
    const randomUser = getRandomUser();
    newUser.innerHTML = `<img class ="user-display" src="${randomUser}"><p class="select-user">${username}</p>`;
    userList.appendChild(newUser);
})


cancelButton.addEventListener("click", async (e) => {
    e.preventDefault();
    joinServerForm.classList.add("hidden");
});

joinButton.addEventListener('click', async (e) => {
    e.preventDefault();
    joinServerInput.value = "";
    joinServerForm.classList.toggle("hidden");

    const UserId = localStorage.getItem("DischatUserId");
    const username = localStorage.getItem("DischatUserName");

    socket.emit('user joins server', { username, joinServerId, UserId });

    let newServer = document.createElement("li");
    newServer.classList.add("servers-li");
    // newServer.innerHTML = `<h3 class="NameDisplay${joinServerId} server-names hidden">${} </h3><img src="/images/sign-in-background.png" class="server-display">`;
    // serverList.append(newServer);



    const res = await fetch(`${api}userservers`, {
        method: 'POST',
        body: JSON.stringify({ joinServerId, UserId }),
        headers: {
            "Content-Type": 'application/json',
        }
    });

    if (!res.ok) {
        throw res;
    }


    const parsedRes = await res.json();
    const server = parsedRes.server;

    channelList.innerHTML = '';
    messageBox.innerHTML = '';
    channelTitle.innerHTML = '';
    userList.innerHTML = '';

    newServer.setAttribute('id', server.id)
    newServer.dataset.serverId = server.id;
    newServer.dataset.serverName = server.serverName;
    serverTitle.innerHTML = server.serverName;
    const randomImg = getRandomImg;
    newServer.innerHTML = `<h3 class="NameDisplay${joinServerId} server-names hidden">${server.serverName} </h3><img src="${randomI" class="server - display">`;

    newServer.addEventListener('mouseenter', async (e) => {
        console.log("in");
        const serverNameDisplay = document.querySelector(`.NameDisplay${newServer.dataset.serverId}`);
        // console.log(serverNameDisplay);
        serverNameDisplay.classList.remove("hidden");
    });

    newServer.addEventListener('mouseleave', async (e) => {
        console.log("out");
        const serverNameDisplay = document.querySelector(`.NameDisplay${newServer.dataset.serverId}`);
        // console.log(serverNameDisplay);
        serverNameDisplay.classList.add("hidden");
    });

    serverList.append(newServer);
    socket.emit('leave channel', `${currentChannelId}`)
    socket.emit('leave server', `${serverId}`)
    serverId = server.id;
    socket.emit('join server', `${serverId}`)
    server.Channels.forEach(channel => {
        let newChannel = document.createElement("li");
        currentChannelId = channel.id;
        newChannel.dataset.channelId = channel.id;
        newChannel.dataset.channelName = channel.channelName;
        newChannel.classList.add("channels-li");
        newChannel.innerHTML = `<p class="select-channel"> # ${channel.channelName}</p>`;
        channelList.prepend(newChannel);
        channelTitle.innerHTML = server.Channels[server.Channels.length - 1].channelName;
    })

    if (server.Channels.length > 0) {
        socket.emit('join channel', `${server.Channels[server.Channels.length - 1].id}`);
        const messageRes = await fetch(`${api}channels/${currentChannelId}/messages`);
        const parsedMessageRes = await messageRes.json();
        const messages = parsedMessageRes.messages;
        messageBox.innerHTML = '';

        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].UserId === null) {
                messageBox.innerHTML += `<p class="messages">DisChat Welcome Bot: <br/> ${messages[i].messageContent}</p>`;
            } else {
                messageBox.innerHTML += `<p class="messages">${messages[i].User.userName}: <br/> ${messages[i].messageContent}</p>`;
            }
        }
    }

    let displayedChannels = document.querySelectorAll('.channels-li');
    displayedChannels.forEach(channel => {
        channel.addEventListener('click', async (e) => {

            socket.emit('leave channel', `${currentChannelId}`);
            currentChannelId = e.currentTarget.dataset.channelId;
            socket.emit('join channel', `${currentChannelId}`)
            textInputBox.classList.remove("hidden");
            textInputBox.classList.add("new-message-form");
            const currentChannelName = e.currentTarget.dataset.channelName;
            channelTitle.innerHTML = currentChannelName;
            // fetch call with channelid to get messages
            const messageRes = await fetch(`${api}channels/${currentChannelId}/messages`);
            const parsedMessageRes = await messageRes.json();
            const messages = parsedMessageRes.messages;
            messageBox.innerHTML = '';
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].UserId === null) {
                    messageBox.innerHTML += `<p class="messages">DisChat Welcome Bot: <br/> ${messages[i].messageContent}</p>`;
                } else {
                    messageBox.innerHTML += `<p class="messages">${messages[i].User.userName}: <br/> ${messages[i].messageContent}</p>`;
                }
            }

        })
    })

    server.Users.forEach(user => {
        let newUser = document.createElement('li');
        newUser.dataset.userId = user.id;
        newUser.classList.add('users-li');
        const randomUser = getRandomUser();
        newUser.innerHTML = `<img class ="user-display" src="${randomUser}"><p class="select-user">${user.userName}</p>`;
        userList.appendChild(newUser);
    });

    newServer.addEventListener('click', async (e) => {

        serverId = e.currentTarget.dataset.serverId;
        serverName = e.currentTarget.dataset.serverName;
        serverTitle.innerHTML = serverName;
        channelList.innerHTML = '';
        userList.innerHTML = '';
        messageBox.innerHTML = '';

        const response = await fetch(`${api}servers/${serverId}/channels`);
        const parsedResponse = await response.json();
        const channels = parsedResponse.channels;
        socket.emit('leave channel', `${currentChannelId}`);
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
            const channelListOnLoad = document.querySelectorAll('.channels-li');
            if (channelListOnLoad.length === 0) {
                deleteIcon.classList.add('hidden');
            } else {
                deleteIcon.classList.remove('hidden');
            }
            const messageRes = await fetch(`${api}channels/${currentChannelId}/messages`);
            const parsedMessageRes = await messageRes.json();
            const messages = parsedMessageRes.messages;
            messageBox.innerHTML = '';
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].UserId === null) {
                    messageBox.innerHTML += `<p class="messages">DisChat Welcome Bot: <br/> ${messages[i].messageContent}</p>`;
                } else {
                    messageBox.innerHTML += `<p class="messages">${messages[i].User.userName}: <br/> ${messages[i].messageContent}</p>`;
                }
            }
        } else {
            currentChannelId = '';
        }



        if (channels.length === 0) {
            channelTitle.innerHTML = "";
            textInputBox.classList.add("hidden");
            textInputBox.classList.remove("new-message-form");
        }


        let displayedChannels = document.querySelectorAll('.channels-li');

        displayedChannels.forEach(channel => {
            channel.addEventListener('click', async (e) => {

                socket.emit('leave channel', `${currentChannelId}`);
                currentChannelId = e.currentTarget.dataset.channelId;
                socket.emit('join channel', `${currentChannelId}`)
                const currentChannelName = e.currentTarget.dataset.channelName;
                textInputBox.classList.remove("hidden");
                textInputBox.classList.add("new-message-form");
                messageBox.innerHTML = '';
                channelTitle.innerHTML = currentChannelName;
                // fetch call with channelid to get messages
                const messageRes = await fetch(`${api}channels/${currentChannelId}/messages`);
                const parsedMessageRes = await messageRes.json();

                const messages = parsedMessageRes.messages;
                for (let i = messages.length - 1; i >= 0; i--) {
                    if (messages[i].UserId === null) {
                        messageBox.innerHTML += `<p class="messages">DisChat Welcome Bot: <br/> ${messages[i].messageContent}</p>`;
                    } else {
                        messageBox.innerHTML += `<p class="messages">${messages[i].User.userName}: <br/> ${messages[i].messageContent}</p>`;
                    }

                }
            })
        })

        const userResponse = await fetch(`${api}servers/${serverId}/users`);
        const parsedUserResponse = await userResponse.json();
        const userArray = parsedUserResponse.users;

        userArray.forEach(user => {
            let newUser = document.createElement('li');
            newUser.dataset.userId = user.id;
            newUser.classList.add('users-li');
            const randomUser = getRandomUser();
            newUser.innerHTML = `<img class ="user-display" src="${randomUser}"><p class="select-user">${user.userName}</p>`;
            userList.appendChild(newUser);
        })

    })


})
