import { ipcRenderer } from "electron";

const $C = (
	tag: keyof HTMLElementTagNameMap,
	style: Partial<CSSStyleDeclaration> = {},
	events: Record<string, (event: Event) => void> = {},
	attribs: Record<string, string> = {}
) => {
	const element = document.createElement(tag);
	Object.assign(element.style, style);
	Object.keys(events).forEach((event) => {
		element.addEventListener(event, events[event])
	});

	Object.keys(attribs).forEach((attrib) => {
		element.setAttribute(attrib, attribs[attrib])
	});

	return element;
}

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
	const password = localStorage.getItem("password_cache");
	const modalsOuterContainer = $C("div");

	const createModal = (headingContent: string, children: Node, onSubmit?: (ev: SubmitEvent) => void) => {
		const modalContainer = $C("div", {
			width: "100%",
			height: "100%",
			position: "absolute",
			backgroundColor: "hsl(0deg, 0%, 0%, 85%)",
			display: "none",
			justifyContent: "center",
			alignItems: "center",
			fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji"
		}, {
			click: (ev) => {
				ev.preventDefault();
				modalContainer.style.display = "none";
			}
		});

		modalsOuterContainer.appendChild(modalContainer);
	
		const modalInner = $C("form", {
			backgroundColor: "hsl(0deg, 0%, 95%, 100%)",
			padding: "0px 10px 10px 10px"
		}, {
			click: (ev) => {
				ev.stopPropagation();
			},
			submit: onSubmit
		});
	
		const heading = $C("h3");
		heading.innerText = headingContent;
		modalInner.appendChild(heading);

		modalInner.appendChild(children);
		modalContainer.appendChild(modalInner);

		return {
			show () {
				modalContainer.style.display = "flex";
			},
			hide () {
				modalContainer.style.display = "none";
			}
		}
	}

	const passwordModal = (() => {
		const innerModal = $C("div");

		const passwordInput = $C("input", {
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
	
		const submitButton = $C("button", {
			marginRight: "5px"
		},{},{
			type: "submit"
		});
		submitButton.innerText = "Enter";

		const clearButton = $C("button", {},{},{
			type: "reset"
		});
		clearButton.innerText = "Clear";

		innerModal.appendChild(submitButton);
		innerModal.appendChild(clearButton);

		return createModal("Input password to exit kiosk.", innerModal, (ev) => {
			ev.preventDefault();

			const input = document.getElementById("password-input") as HTMLInputElement;
			if (input.value === password) {
				ipcRenderer.send("CLOSE_KIOSK")
			}
		});
	})();

	ipcRenderer.on("PASSWORD_REQUEST", () => {
		passwordModal.show();
	});

	const externalLinksWarningModal = (() => {
		return createModal(
			"External links are not supported in this locked full screen mode.",
			new Text("Click anywhere outside of this box to continue.")
		);
	})();

	ipcRenderer.on("EXTERNAL_URL_NOT_PERMITTED", () => {
		externalLinksWarningModal.show();
	});

	window.addEventListener('DOMContentLoaded' , async () => {
		while (document.body.children[0].tagName !== "EMBED") {
			await sleep(50);
		}
	
		document.body.appendChild(modalsOuterContainer);
	})
})();