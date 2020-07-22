const infoButton = document.querySelector('.home-li');
const appInfo = document.querySelector('.app-info');

infoButton.addEventListener("click", async(e)=>{})

infoButton.addEventListener("click", async (e) => {
    appInfo.classList.toggle("hidden");

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
