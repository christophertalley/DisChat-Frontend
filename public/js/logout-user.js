// const api = document.querySelector('link[rel="api"]').href;

const logoutButton = document.getElementById("logout-icon");
const logoutConfirmForm = document.querySelector(".confirm-logout");
const confirmLogoutButton = document.querySelector(".logout-confirm")
const denyLogoutButton = document.querySelector(".logout-cancel")

logoutButton.addEventListener("click", (e) => {
    logoutConfirmForm.classList.toggle("hidden");
});

denyLogoutButton.addEventListener("click", async (e) => {
    logoutConfirmForm.classList.toggle("hidden");
});

confirmLogoutButton.addEventListener("click", async (e) => {
    // e.preventDefault();
    try {
        e.preventDefault();

        // window.location.href = '/log-in';
        window.location.replace("/");
        localStorage.clear();

    } catch (e) {
        console.error(e);
    }
});
