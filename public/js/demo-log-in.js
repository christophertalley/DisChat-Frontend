import { api } from './utils.js';

// const api = document.querySelector('link[rel="api"]').href;

// const handleErrors = async (err) => {
//     if (err.status >= 400 && err.status < 600) {
//         const errorJSON = await err.json();
//         console.log(errorJSON);
//         const errorsContainer = document.querySelector(".errors-container");
//         let errorsHtml = [
//             `
//         <div class="alert alert-danger">
//         Something went wrong. Please try again.
//         </div>
//         `,
//         ];
//         const { errors } = errorJSON;
//         if (errors && Array.isArray(errors)) {
//             errorsHtml = errors.map(
//                 (message) => `
//             <div class="alert alert-danger">
//             ${message}
//             </div>
//             `
//             );
//         }
//         errorsContainer.innerHTML = errorsHtml.join("");
//     } else {
//         alert(
//             "Something went wrong. Please check your internet connection and try again!"
//         );
//     }
// // };
const emailInput = document.querySelector(".demo-input");
const pwInput = document.querySelector(".demo-input-pw");
const logInButton = document.querySelector(".demo-submit");


const email = "demo@email.com";
const password = "demopassword";
let test = "";



// function emailStringMaker(email) {
//     let emailString = "";
//     let counter = 0;
//     if (counter !== email.length - 1) {
//         emailDemo(email, emailString, counter);
//     } else {
//         clearInterval(interval);
//     }
//     console.log(emailString);
// }


// function emailDemo(email, emailString, counter) {

//     emailString += email[counter];
//     counter++;
//     console.log(emailString);
//     console.log(counter);

// }
// const loadDemo = () => {
//     let emptyStr = "";
//     const interval = setInterval(emailStringMaker, 1000, email);

//     if (counter !== email.length - 1) {
//         emailDemo(email, emailString, counter);
//     } else {
//         clearInterval(interval);
//     }

// }




// await passwordDemo()

async function emailText(letters, i) {
    setTimeout(() => {
        emailInput.value += letters;
    }, 100 * i)
}


async function emailDemo(email) {
    for (let i = 0; i < email.length; i++) {
        emailText(email[i], i);
    }
}

async function passwordInput(letters, i) {
    await setTimeout(() => {
        pwInput.value += letters;
    }, 100 * i)
}


async function passwordDemo(password) {
    console.log("outside");
    for (let i = 0; i < password.length; i++) {
        passwordInput(password[i], i);
    }
}

// await clicker();

const clicker = async () => {
    logInButton.click();
}

async function runForm(email, password) {
    // const firstInput = await emailDemo(email);
    // // await setTimeout(() => { console.log('Demo Email has finished typing') }, 1000)
    // const secondInput = await passwordDemo(password);
    // // await firstInput;
    // // await secondInput;

    setTimeout(async () => await emailDemo(email), 1000);
    setTimeout(async () => await passwordDemo(password), 3000);
    setTimeout(async () => await clicker(), 5000);
    // await clicker();
};
// setTimeout(async () => await emailDemo(email), 10000);

runForm(email, password);


// for (let i = 0; i < password.length; i++) {
//     setTimeout(() => {
//         pwInput.value += password[i];
//     }, 1000)
// }

// const typeChars = (string, htmlEle) => {
//     const typedLetters = [];
//     const chars = string.split("");

//     for (let i = 0; i < chars.length; i++) {
//         while (chars[i] !== chars[chars.length - 1]) {

//             clearInterval()
//         }
//     }
//     htmlEle.innerHtml = typedLetters.join("");

// }

// typeChars("demo@email.com", emailInput);

const demoLogInForm = document.querySelector('.demo-log-in-form');
demoLogInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // const formData = new FormData(logInForm);
    const email = "demo@email.com"
    const password = "demopassword"

    // const email = formData.get("email");
    // const password = formData.get("password");

    const body = { email, password };

    try {
        const res = await fetch(`${api}users/token`, {
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
        localStorage.setItem('DischatUserName', name);
        window.location.href = '/home';
    } catch (e) {
        console.error(e);
    }
});
