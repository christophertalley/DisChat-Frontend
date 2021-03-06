// import handleErrors from ('/js/utils.js');
import { api } from './utils.js';



const handleErrors = async (err) => {
    if (err.status >= 400 && err.status < 600) {
        const errorJSON = await err.json();
        const errorsContainer = document.querySelector(".errors-container");
        let errorsHtml = [
            `
        <div class="alert alert-danger">
            Something went wrong. Please try again.
        </div>
      `,
        ];
        const { errors } = errorJSON;
        if (errors && Array.isArray(errors)) {
            errorsHtml = errors.map(
                (message) => `
          <div class="alert alert-danger">
              ${message}
          </div>
        `
            );
        }
        errorsContainer.innerHTML = errorsHtml.join("");
    } else {
        alert(
            "Something went wrong. Please check your internet connection and try again!"
        );
        console.error(err);
    }
};


const signUpForm = document.querySelector('.sign-up-form');
signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(signUpForm);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    const body = { username, email, password };

    try {
        const res = await fetch(`${api}users`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": 'application/json',
            }
        });
        if (!res.ok) {
            throw res;
        }
        const { token, user: { id, name } } = await res.json();

        localStorage.setItem('DischatAccessToken', token);
        localStorage.setItem('DischatUserId', id);
        localStorage.setItem('DischatUserName', name)
        window.location.href = '/home';
    } catch (e) {
        handleErrors(e);
    }
});
