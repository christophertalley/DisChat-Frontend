const closeForms = document.querySelectorAll(".close-out-form");
const weirdForms = document.querySelectorAll(".weird-form");

// Each close out form icon has an id that macthes the class of the form
// That it is on. When a user clicks on it, the interpolated version
// of e.target.id is used to toggle the desired form close because the id matches

closeForms.forEach((button) => {
    button.addEventListener("click", async (e) => {

        let desiredForm = document.querySelector(`.${e.target.id}`);
        desiredForm.classList.toggle("hidden");
    })
});

// WEIRD FORMS  ARE THE ONES WITH JUST CONFIRM OR DENY AND
// had to be styled differently

weirdForms.forEach((button) => {
    button.addEventListener("click", async (e) => {
        console.log(e.target.id)
        let desiredForm = document.querySelector(`.${e.target.id}`);
        desiredForm.classList.toggle("hidden");
    })
});
