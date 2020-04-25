import { api } from './utils';
let serverId;
let serverName;
let currentChannelId;
let joinServerId;



window.addEventListener("DOMContentLoaded", async (e) => {
    const serverList = document.querySelector("#server-list");
    const userList = document.querySelector('#users-list');
    // const channelList = document.querySelector('.display-channels')
    const userId = localStorage.getItem("DischatUserId");
    const addServer = document.querySelector("#add-button");
    const serverTitle = document.querySelector(".server-name");
    const channelTitle = document.getElementById('channel-name');
    const userName = document.querySelector('.username');

    userName.innerHTML = localStorage.getItem('DischatUserName');

    try {
        const res = await fetch(`${api}${userId}/servers`);
        const parsedRes = await res.json();
        const serverArray = parsedRes.servers;
        const initialServer = serverArray[0];
        serverId = initialServer.id;
        serverName = initialServer.serverName;
        serverTitle.innerHTML = serverName;

        // console.log()
        initialServer.Channels.forEach(channel => {
            let newChannel = document.createElement("li");
            currentChannelId = channel.id;
            newChannel.dataset.channelId = channel.id;
            newChannel.dataset.channelName = channel.channelName;
            newChannel.classList.add("channels-li");
            newChannel.innerHTML = `<p class="select-channel"> # ${channel.channelName}</p>`;
            channelList.append(newChannel);
            channelTitle.innerHTML = initialServer.Channels[initialServer.Channels.length - 1].channelName;
        })
        if (initialServer.Channels.length > 0) {
            socket.emit('join channel', `${initialServer.Channels[initialServer.Channels.length - 1].id}`);
            const messageRes = await fetch(`${api}channels/${currentChannelId}/messages`);
            const parsedMessageRes = await messageRes.json();
            const messages = parsedMessageRes.messages;
            messageBox.innerHTML = '';
            for (let i = messages.length - 1; i > 0; i--) {
                messageBox.innerHTML += `<p class="messages">${messages[i].User.userName}: <br/> ${messages[i].messageContent}</p>`;
            }
            // messages.forEach(message => {
            //     messageBox.innerHTML += `<p class="messages">${message.User.userName}: <br/> ${message.messageContent}</p>`;
            // });
        }

        initialServer.Users.forEach(user => {
            let newUser = document.createElement('li');
            newUser.classList.add('users-li');
            newUser.innerHTML = `<p class="select-user"> # ${user.userName}</p>`;
            userList.appendChild(newUser);
        });

        // initialServer


        let displayedChannels = document.querySelectorAll('.channels-li');
        // console.log(displayedChannels);
        displayedChannels.forEach(channel => {
            channel.addEventListener('click', async (e) => {
                socket.emit('leave channel', `${currentChannelId}`);
                currentChannelId = e.currentTarget.dataset.channelId;
                socket.emit('join channel', `${currentChannelId}`)

                const currentChannelName = e.currentTarget.dataset.channelName;
                channelTitle.innerHTML = currentChannelName;
                // fetch call with channelid to get messages
                const messageRes = await fetch(`${api}channels/${currentChannelId}/messages`);
                const parsedMessageRes = await messageRes.json();
                const messages = parsedMessageRes.messages;
                messageBox.innerHTML = '';
                for (let i = messages.length - 1; i > 0; i--) {
                    messageBox.innerHTML += `<p class="messages">${messages[i].User.userName}: <br/> ${messages[i].messageContent}</p>`;
                }
                // messages.forEach(message => {
                //     messageBox.innerHTML += `<p class="messages">${message.User.userName}: <br/> ${message.messageContent}</p>`;
                // });

                // messsages.forEach((message)=> {
                //     if (message.ChatId)
                // })
            })
        })

        // console.log(serverArray);

        serverArray.forEach(server => {
            let newServer = document.createElement("li");
            newServer.dataset.serverId = server.id;
            newServer.dataset.serverName = server.serverName;
            newServer.classList.add("servers-li");
            newServer.innerHTML = '<img src="/images/sign-in-background.png" class="server-display">';
            serverList.append(newServer);
        });

        const listServers = document.querySelectorAll(".servers-li");

        for (let i = 0; i < listServers.length; i++) {
            // console.log(listServers[i]);
            listServers[i].addEventListener('click', async (e) => {
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

                    const messageRes = await fetch(`${api}channels/${currentChannelId}/messages`);
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
                        const messageRes = await fetch(`${api}channels/${currentChannelId}/messages`);
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

                const userResponse = await fetch(`${api}servers/${serverId}/users`);
                const parsedUserResponse = await userResponse.json();
                const userArray = parsedUserResponse.users;
                console.log(userArray);
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
        }

    } catch (e) {
        console.error(e)
    }
})
