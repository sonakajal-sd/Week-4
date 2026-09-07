const FormValidator = require("./formValidator");

test("shows error when name is empty", () => {

    document.body.innerHTML = `
        <form id="form">
            <input id="name" />
            <span id="error"></span>
        </form>
    `;

    const form = document.querySelector("#form");

    const validator = new FormValidator(form);

    validator.validate();

    expect(document.querySelector("#error").textContent)
        .toBe("Name is required");
});