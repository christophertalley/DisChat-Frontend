import { api } from './utils.js';
const addServer = document.querySelector("#add-button");
const serverList = document.querySelector("#server-list");
const formServer = document.querySelector(".create-box");
const buttonNewServer = document.querySelector(".submit");
const serverInput = document.getElementById('newServer');
const serverTitle = document.querySelector('.server-name');
const textInputBox = document.querySelector("#new-message-form");

addServer.addEventListener("click", async (e) => {
    e.preventDefault();
    formServer.classList.toggle("hidden");
})


formServer.addEventListener("submit", async (e) => {
    e.preventDefault();

    const channelTitle = document.getElementById('channel-name');
    let newServer = document.createElement("li");
    newServer.classList.add("servers-li");

    newServer.innerHTML = '<img src="/images/sign-in-background.png" class="server-display">';
    serverList.append(newServer);
    formServer.classList.add("hidden");
    textInputBox.classList.add("hidden");
    textInputBox.classList.remove("new-message-form");


    const formData = new FormData(formServer);

    let serverName = formData.get("serverName");
    // console.log(serverName);
    const userId = localStorage.getItem("DischatUserId");

    const body = { serverName };


    userList.innerHTML = '';
    serverInput.value = '';
    try {
        const res = await fetch(`${api}${userId}/servers`, {
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
        // console.log(parsedRes)
        const server = parsedRes.server;
        channelList.innerHTML = '';
        messageBox.innerHTML = '';
        channelTitle.innerHTML = "";
        newServer.setAttribute('id', server.id)
        newServer.dataset.serverId = server.id;
        newServer.dataset.serverName = server.serverName;
        serverTitle.innerHTML = server.serverName;
        socket.emit('leave channel', `${currentChannelId}`)

        serverId = server.id;

        const userResponse = await fetch(`${api}servers/${serverId}/users`);
        const parsedUserResponse = await userResponse.json();
        const userArray = parsedUserResponse.users;

        // let newUserList = "";
        userArray.forEach(user => {
            let newUser = document.createElement('li');
            newUser.classList.add('users-li');

            // let newUser = `<li class='users-li'><p class="select-user"> # ${user.userName}</p></li>`
            newUser.innerHTML = `<p class="select-user"> # ${user.userName}</p>`;
            // newUserList += newUser;
            // console.log(newUserList);
            userList.appendChild(newUser);
            // userList.innerHTML = newUserList;
        })


    } catch {

    }

    newServer.addEventListener('click', async (e) => {
        //     serverId = e.currentTarget.dataset.serverId;
        //     serverName = e.currentTarget.dataset.serverName;
        //     serverTitle.innerHTML = serverName;
        //     channelList.innerHTML = '';
        //     const response = await fetch(`http://localhost:8080/servers/${serverId}/channels`);
        //     const parsedResponse = await response.json();
        //     const channels = parsedResponse.channels;
        //     messageBox.innerHTML = '';
        //     if (channels.length === 0) {
        //         channelTitle.innerHTML = "";
        //     }
        //     channels.forEach(channel => {
        //         let newChannel = document.createElement("li");
        //         newChannel.dataset.channelId = channel.id;
        //         newServer.dataset.channelName = channel.channelName;
        //         newChannel.classList.add("channels-li");
        //         newChannel.innerHTML = `<p class="select-channel"> # ${channel.channelName}</p>`;
        //         channelList.appendChild(newChannel);
        //         channelTitle.innerHTML = channels[0].channelName;
        //     })
        //     // const userResponse = await fetch(`http://localhost:8080/servers/${serverId}/users`);
        //     // const parsedUserResponse = await userResponse.json();
        //     // const userArray = parsedUserResponse.users;
        // })

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

            const messageRes = await fetch(`http://localhost:8080/channels/${currentChannelId}/messages`);
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
                for (let i = messages.length - 1; i >= 0; i--) {
                    if (messages[i].UserId === null) {
                        messageBox.innerHTML += `<p class="messages">DisChat Welcome Bot: <br/> ${messages[i].messageContent}</p>`;
                    } else {
                        messageBox.innerHTML += `<p class="messages">${messages[i].User.userName}: <br/> ${messages[i].messageContent}</p>`;
                    }

                }
                // messages.forEach(message => {
                //     messageBox.innerHTML += `<p class="messages">${message.User.userName}: <br/> ${message.messageContent}</p>`;
                // });
            })
        })

        const userResponse = await fetch(`http://localhost:8080/servers/${serverId}/users`);
        const parsedUserResponse = await userResponse.json();
        const userArray = parsedUserResponse.users;

        // let newUserList = "";
        userArray.forEach(user => {
            let newUser = document.createElement('li');
            newUser.classList.add('users-li');

            // let newUser = `<li class='users-li'><p class="select-user"> # ${user.userName}</p></li>`
            newUser.innerHTML = `<p class="select-user"> # ${user.userName}</p>`;
            // newUserList += newUser;
            // console.log(newUserList);
            userList.appendChild(newUser);
            // userList.innerHTML = newUserList;
        })

        // if ()
        // userList.innerHTML = newUserList;
        // userList.innerHTML = '';
    })


});
