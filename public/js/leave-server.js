import { api } from './utils.js';
const leaveButton = document.getElementById("leave-button");
const leaveServer = document.querySelector(".confirm-leave-server");
const leaveSubmit = document.querySelector(".server-leave-confirm");
const leaveDeny = document.querySelector(".server-leave-deny");

leaveButton.addEventListener("click", async (e) => {
    leaveServer.classList.toggle("hidden");
});

leaveSubmit.addEventListener("click", async (e) => {
    // Got rid of this to make the page reload again. I have no idea how it was ever reloading
    // with this in the code.
    // e.preventDefault();
    leaveServer.classList.add("hidden");



    const userId = localStorage.getItem("DischatUserId");
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
