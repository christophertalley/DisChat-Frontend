// import { api } from './utils.js';

// const api = document.querySelector('link[rel="api"]').href;

const searchIcon = document.getElementById("join-button");
const joiningServerLabel = document.getElementById("join-server-confirm-text");
const serverNotFoundText = document.getElementById('server-not-found-text');


searchIcon.addEventListener("click", (e) => {
    searchForm.classList.toggle('hidden');


    if (!leaveServer.classList.contains('hidden')) {
        leaveServer.classList.add('hidden')
    }
    if (!formChannel.classList.contains('hidden')) {
        formChannel.classList.add('hidden')
    }
    if (!formServer.classList.contains('hidden')) {
        formServer.classList.add('hidden')
    }


    joinServerInput.value = "";
    serverNotFoundText.innerHTML = '';
    joinServerInput.focus();
})

searchForm.addEventListener('input', e => {
    if (serverNotFoundText.innerHTML) {
        serverNotFoundText.innerHTML = ''
    }
})

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(searchForm);

    let joinServerName = formData.get("joinServerName");
    joiningServerLabel.innerHTML = `Do you wish to join the following server: ${joinServerName}? `

    try {

        const res = await fetch(`${api}servers/find/${joinServerName}`);
        if (!res.ok) {
            throw res;
        }


        const parsedRes = await res.json();

        if (parsedRes === 'server not found') {
            // Needs better styling
            serverNotFoundText.innerHTML = "It looks like that server doesn't exist."
        } else {
            searchForm.classList.add('hidden');
            const server = parsedRes.foundServer;

            joinServerId = server.id;
            joinServerForm.classList.remove("hidden");
        }



    } catch (e) {
        // console.log(e)
    }
})
