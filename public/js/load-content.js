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
        const res = await fetch(`http://localhost:8080/${userId}/servers`);
        const parsedRes = await res.json();
        const serverArray = parsedRes.servers;
        const initialServer = serverArray[0];

        // This if block loads the servers and channels if there are any.
        if (initialServer) {
            serverId = initialServer.id;
            serverName = initialServer.serverName;
            serverTitle.innerHTML = serverName;

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
            }

            initialServer.Users.forEach(user => {
                let newUser = document.createElement('li');
                newUser.classList.add('users-li');
                newUser.innerHTML = `<p class="select-user"> # ${user.userName}</p>`;
                userList.appendChild(newUser);
            });
        } else {
            // This else block loads a server called Your First Server and
            // a channel called Your First Channel. The channel displays a message
            // explaining how the app works.


            // Variable was declared later also so commented that one out:
            const channelTitle = document.getElementById('channel-name');

            let newServer = document.createElement("li");
            newServer.classList.add("servers-li");

            newServer.innerHTML = '<img src="/images/sign-in-background.png" class="server-display">';
            serverList.append(newServer);

            // Don't know what this is for:
            // textInputBox.classList.remove("new-message-form");

            const userId = localStorage.getItem("DischatUserId");

            const body = { serverName: 'Your First Server' };

            serverInput.value = '';
            try {
                const res = await fetch(`http://localhost:8080/${userId}/servers`, {
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
                channelTitle.innerHTML = '';

                // Why are we both giving it an id of server.id and setting an attribute
                // serverId of server.id?
                newServer.setAttribute('id', server.id)
                newServer.dataset.serverId = server.id;
                newServer.dataset.serverName = server.serverName;
                serverTitle.innerHTML = server.serverName;

                serverId = server.id;

            } catch (e) {
                console.error(e);
            }


            // Adds click event listener to new server
            newServer.addEventListener('click', async (e) => {
                serverId = e.currentTarget.dataset.serverId;
                serverName = e.currentTarget.dataset.serverName;
                serverTitle.innerHTML = serverName;
                channelList.innerHTML = '';
                const response = await fetch(`http://localhost:8080/servers/${serverId}/channels`);
                const parsedResponse = await response.json();
                const channels = parsedResponse.channels;
                messageBox.innerHTML = '';
                if (channels.length === 0) {
                    channelTitle.innerHTML = "";
                }
                channels.forEach(channel => {
                    let newChannel = document.createElement("li");
                    newChannel.dataset.channelId = channel.id;
                    newServer.dataset.channelName = channel.channelName;
                    newChannel.classList.add("channels-li");
                    newChannel.innerHTML = `<p class="select-channel"> # ${channel.channelName}</p>`;
                    channelList.appendChild(newChannel);
                    channelTitle.innerHTML = channels[0].channelName;
                })
            })


            // const channelTitle = document.getElementById('channel-name');

            let firstChannel = document.createElement("li");

            firstChannel.classList.add("channels-li");
            firstChannel.innerHTML = `<p class="select-channel"> # Your First Channel</p>`;
            channelList.prepend(firstChannel);
            channelTitle.innerHTML = 'Your First Channel';

            // Don't know what this is for:
            textInputBox.classList.add("new-message-form");

            firstChannel.addEventListener('click', async (e) => {
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


            try {

                const res = await fetch(`http://localhost:8080/servers/${serverId}/channels`, {
                    method: 'POST',
                    body: JSON.stringify({ channelName: 'Your First Channel' }),
                    headers: {
                        "Content-Type": 'application/json',
                    }
                });
                if (!res.ok) {
                    throw res;
                }
                // messageBox.innerHTML = '';
                const parsedRes = await res.json();

                const newChannel = parsedRes.channel;
                firstChannel.dataset.channelId = newChannel.id;
                firstChannel.dataset.channelName = newChannel.channelName;

                currentChannelId = newChannel.id;
                socket.emit('join channel', `${currentChannelId}`);

                const welcomeMessage = "Welcome to DisChat! On the left side of the screen is your list of servers. You already have one! To the left of that is your list of channels. You have one of those, too. The plus sign lets you create a server. Under that is the button to join a server that someone else made. Click the reddish button under that, and you'll leave a server. Don't worry, you can join the same server again if you want."

                messageBox.innerHTML += `<p class="messages">DisChat Welcome Bot: <br/>${welcomeMessage}</p>`;


                try {
                    const res = await fetch(`http://localhost:8080/channels/${currentChannelId}/messages`, {
                        method: 'POST',
                        body: JSON.stringify({
                            messageContent: welcomeMessage,
                            UserId: null,
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


            } catch (e) {
                console.error(e)
            }
        }

        // END OF ELSE STATEMENT


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
                const response = await fetch(`http://localhost:8080/servers/${serverId}/channels`);
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
        }

    } catch (e) {
        console.error(e)
    }
})
