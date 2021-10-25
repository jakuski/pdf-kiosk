(function ($) {
    var passwordStorageKey = "password_cache";
    var form = $("form");
    var fileInput = $("file");
    var passwordInput = $("password");
    var passwordVisbilityButton = $("password-visibility");
    var submitButton = $("submit");
    // Password Cache
    var storedPassword = localStorage.getItem(passwordStorageKey);
    if (storedPassword) {
        passwordInput.value = storedPassword;
    }
    // Password Visbility
    passwordVisbilityButton.addEventListener("click", function (ev) {
        ev.preventDefault();
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        }
        else {
            passwordInput.type = "password";
        }
    });
    // on Submit Event
    form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var data = new FormData(form);
        var submitData = {
            path: data.get("file").path,
            password: data.get("password")
        };
        localStorage.setItem(passwordStorageKey, submitData.password);
        kiosk_app.show(submitData);
    });
})(document.getElementById.bind(document));
//# sourceMappingURL=loader.js.map