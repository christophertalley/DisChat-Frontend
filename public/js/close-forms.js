const closeForm = document.querySelectorAll(".close-out-form");


// Each close out form icon has an id of the form
// That it is on. When a user clicks on it, the interpolated version
// of e.target.id is used toggle the desired form close because the id matches

closeForm.forEach((button) => {
    button.addEventListener("click", async (e) => {
        console.log(e.target.id)
        let desiredForm = document.querySelector(`.${e.target.id}`);
        desiredForm.classList.toggle("hidden");
    })
});
