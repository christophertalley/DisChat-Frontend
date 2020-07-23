// import { api } from './utils.js';
// const api = document.querySelector('link[rel="api"]').href;
const leaveButton = document.getElementById("leave-button");
// const leaveServer = document.querySelector(".confirm-leave-server");
const leaveSubmit = document.querySelector(".server-leave-confirm");
const leaveDeny = document.querySelector(".server-leave-deny");

socket.on('user leaves server', (userId) => {
    const userList = document.querySelectorAll('.users-li');

    userList.forEach(user => {
        if (user.dataset.userId === userId) {
            user.remove();
        }
    })
})

leaveButton.addEventListener("click", async (e) => {
    leaveServer.classList.toggle("hidden");

    if (!searchForm.classList.contains('hidden')) {
        searchForm.classList.add('hidden')
    }
    if (!formServer.classList.contains('hidden')) {
        leaveServer.classList.add('hidden')
    }
    if (!formChannel.classList.contains('hidden')) {
        formChannel.classList.add('hidden')
    }
});

leaveSubmit.addEventListener("click", async (e) => {
    // Got rid of this to make the page reload again. I have no idea how it was ever reloading
    // with this in the code.
    // e.preventDefault();
    const userId = localStorage.getItem("DischatUserId");

    socket.emit('leave server', `${serverId}`);
    socket.emit('user leaves server', { userId, serverId });

    leaveServer.classList.add("hidden");


    const deleteServerId = serverId;

    const res = await fetch(`${api}userservers/${userId}/${deleteServerId}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw res;
    }
})

leaveDeny.addEventListener("click", async (e) => {
    e.preventDefault();
    leaveServer.classList.add("hidden");
});
