class FormValidator {
    constructor(form) {
        this.form = form;
    }

    validate() {
        const input = this.form.querySelector("#name");
        const error = this.form.querySelector("#error");

        if (!input.value) {
            error.textContent = "Name is required";
            return false;
        }

        error.textContent = "";
        return true;
    }
}

module.exports = FormValidator;