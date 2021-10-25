setTimeout(function () {
    prompt("Please enter password to quit kiosk mode.");
}, 5000);
var $C = function (tag, style, events, attribs) {
    if (style === void 0) { style = {}; }
    if (events === void 0) { events = {}; }
    if (attribs === void 0) { attribs = {}; }
    var element = document.createElement(tag);
    Object.assign(element.style, style);
    Object.keys(events).forEach(function (event) {
        element.addEventListener(event, events[event]);
    });
    Object.keys(attribs).forEach(function (attrib) {
        element.setAttribute(attrib, attribs[attrib]);
    });
    return element;
};
(function () {
    var createModal = function () {
        var modalContainer = $C("div", {
            width: "100%",
            height: "100%",
            position: "absolute",
            backgroundColor: "hsl(0deg, 0%, 0%, 85%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji"
        });
        var modalInner = $C("form", {
            backgroundColor: "hsl(0deg, 0%, 95%, 100%)",
            padding: "0px 10px 10px 10px"
        });
        var heading = $C("h3");
        heading.innerText = "Input password to exit kiosk.";
        modalInner.appendChild(heading);
        var passwordInput = $C("input", {
            width: "100%",
            marginBottom: "10px",
            boxSizing: "border-box"
        }, {}, {
            required: "true",
            type: "password",
            name: "password",
            placeholder: "Password"
        });
        modalInner.appendChild(passwordInput);
        var submitButton = $C("button", {
            marginRight: "5px"
        }, {}, {
            type: "submit"
        });
        submitButton.innerText = "Enter";
        var clearButton = $C("button", {}, {}, {
            type: "reset"
        });
        clearButton.innerText = "Clear";
        modalInner.appendChild(submitButton);
        modalInner.appendChild(clearButton);
        modalContainer.appendChild(modalInner);
        document.body.appendChild(modalContainer);
    };
    setTimeout(createModal, 3000);
})();
//# sourceMappingURL=kiosk.js.map