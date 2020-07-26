# [DisChat](https://dischat-application.herokuapp.com/)
Click on the "Demo" button to sign in as a demo user

## What is DisChat?
DisChat is a full-stack chat application in which users can create "servers" and channels within those servers in order to send messages to each other in real time.

## Developers

- [Chris Talley](https://christalley.dev/) ([GitHub](https://github.com/christophertalley) | [LinkedIn](https://www.linkedin.com/in/chris-talley-91814a19b) | [AngelList](https://angel.co/u/chris-talley-3))
- [Mark Mansolino](https://markjm610.github.io/) ([GitHub](https://github.com/markjm610) | [LinkedIn](https://www.linkedin.com/in/markmansolino/) | [AngelList](https://angel.co/u/mark-mansolino))
- Alfredo Quiroga ([GitHub](https://github.com/SauceKnight) | [LinkedIn](https://www.linkedin.com/in/alfredoquiroga96/))
- Landing page by Geoffrey Otieno ([GitHub](https://github.com/gootieno) | [LinkedIn](https://www.linkedin.com/in/geoffrey-otieno-57015966/))

## Technologies

- JavaScript
- Express
- Node
- PostgreSQL
- Sequelize
- Pug
- CSS3
- HTML5
- Socket.IO

## Features

### Instant messaging between users without reloading using WebSocket protocol:
![messaging](https://media.giphy.com/media/kgZuvRCqi3RXNDIRUT/giphy.gif)

### Switching servers, displaying a new set of channels and users within a server
![switching-servers](https://media.giphy.com/media/H1MvNYYlwYUSt9x45X/giphy.gif)

### Switching channels, displaying and sending new messages exclusive to each channel
![switching-channels](https://media.giphy.com/media/fr5OZd3nrUwxuQ42T6/giphy.gif)

### Adding a server and channels within the new server, and sending messages exclusive to those channels:
![adding-server-and-channel](https://media.giphy.com/media/Rki1pVcjVa4kGi1wtL/giphy.gif)

### Joining a server by searching for the name
![joining-a-server](https://media.giphy.com/media/KDo1imHaNCZIAmUWo7/giphy.gif)

### Leaving a server
![leaving-a-server](https://media.giphy.com/media/jQaqFyTEXI7GRlgfpo/giphy.gif)

## Code Highlights


### Path of a WebSocket event from client -> server -> clients

#### Client event emitter
```javascript
deleteFormConfirmButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const userThatDeleted = localStorage.getItem('DischatUserName')
    
    // Inside a click event handler, emit a WebSocket event to the server. The arguments are a string identifier and an object with necessary information
    socket.emit('delete channel', { channelId: currentChannelId, serverId, userThatDeleted });
    
    // rest of code omitted
});
```

#### Server Socket.IO event handler and emitter
```javascript
// All server WebSocket event handlers are inside here
io.on('connection', (socket) => {

// Each event has a string identifier and a callback function that takes in an argument sent from the client
    socket.on('delete channel', (deleteObject) => {
        const { channelId, serverId, userThatDeleted } = deleteObject;
        
        // Every client in the room except the client that emitted the original event gets the 'delete channel' event from the server and the necessary      information
        socket.in(`${serverId}`).broadcast.emit('delete channel', { channelId, userThatDeleted });
    })
    
    // rest of code omitted
});
```

#### Client Socket.IO event handler

```javascript
// Each event has a string identifier and a callback function that takes in an argument sent from the server
socket.on('delete channel', ({ channelId, userThatDeleted }) => {
    
    const channelList = document.querySelectorAll('.channels-li');
    
    // Find the deleted channel and change the title
    channelList.forEach(channel => {
        if (channel.dataset.channelId === channelId) {
            channel.remove();
            channelTitle.innerHTML = `This Channel Has Been Deleted By ${userThatDeleted}`
        }
    })
    const channelListAfterRemove = document.querySelectorAll('.channels-li');

    // Hide page elements corresponding to deleted channel
    if (channelListAfterRemove.length === 0) {
        deleteIcon.classList.add('hidden');
        textInputBox.classList.add("hidden");
        textInputBox.classList.remove("new-message-form");
    }
})
```

## Links

[Back end repository](https://github.com/SauceKnight/DisChat)


