"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var electron_1 = require("electron");
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
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, modalsOuterContainer, createModal, passwordModal, externalLinksWarningModal;
    return __generator(this, function (_a) {
        password = localStorage.getItem("password_cache");
        modalsOuterContainer = $C("div");
        createModal = function (headingContent, children, onSubmit) {
            var modalContainer = $C("div", {
                width: "100%",
                height: "100%",
                position: "absolute",
                backgroundColor: "hsl(0deg, 0%, 0%, 85%)",
                display: "none",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji"
            }, {
                click: function (ev) {
                    ev.preventDefault();
                    modalContainer.style.display = "none";
                }
            });
            modalsOuterContainer.appendChild(modalContainer);
            var modalInner = $C("form", {
                backgroundColor: "hsl(0deg, 0%, 95%, 100%)",
                padding: "0px 10px 10px 10px"
            }, {
                click: function (ev) {
                    ev.stopPropagation();
                },
                submit: onSubmit
            });
            var heading = $C("h3");
            heading.innerText = headingContent;
            modalInner.appendChild(heading);
            modalInner.appendChild(children);
            modalContainer.appendChild(modalInner);
            return {
                show: function () {
                    modalContainer.style.display = "flex";
                },
                hide: function () {
                    modalContainer.style.display = "none";
                }
            };
        };
        passwordModal = (function () {
            var innerModal = $C("div");
            var passwordInput = $C("input", {
                width: "100%",
                marginBottom: "10px",
                boxSizing: "border-box"
            }, {}, {
                required: "true",
                type: "password",
                name: "password",
                placeholder: "Password",
                id: "password-input"
            });
            innerModal.appendChild(passwordInput);
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
            innerModal.appendChild(submitButton);
            innerModal.appendChild(clearButton);
            return createModal("Input password to exit kiosk.", innerModal, function (ev) {
                ev.preventDefault();
                var input = document.getElementById("password-input");
                if (input.value === password) {
                    electron_1.ipcRenderer.send("CLOSE_KIOSK");
                }
            });
        })();
        electron_1.ipcRenderer.on("PASSWORD_REQUEST", function () {
            passwordModal.show();
        });
        externalLinksWarningModal = (function () {
            return createModal("External links are not supported in this locked full screen mode.", new Text("Click anywhere outside of this box to continue."));
        })();
        electron_1.ipcRenderer.on("EXTERNAL_URL_NOT_PERMITTED", function () {
            externalLinksWarningModal.show();
        });
        window.addEventListener('DOMContentLoaded', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(document.body.children[0].tagName !== "EMBED")) return [3 /*break*/, 2];
                        return [4 /*yield*/, sleep(50)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2:
                        document.body.appendChild(modalsOuterContainer);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); })();
//# sourceMappingURL=kiosk.js.map