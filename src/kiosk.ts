setTimeout(() => {
	prompt("Please enter password to quit kiosk mode.")
}, 5000);

const $C = (
	tag: keyof HTMLElementTagNameMap,
	style: Partial<CSSStyleDeclaration> = {},
	events: Record<string, () => void> = {},
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

(() => {

	const createModal = () => {
		const modalContainer = $C("div", {
			width: "100%",
			height: "100%",
			position: "absolute",
			backgroundColor: "hsl(0deg, 0%, 0%, 85%)",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji"
		});
	
		const modalInner = $C("form", {
			backgroundColor: "hsl(0deg, 0%, 95%, 100%)",
			padding: "0px 10px 10px 10px"
		});
	
		const heading = $C("h3");
		heading.innerText = "Input password to exit kiosk.";
		modalInner.appendChild(heading);
	
		const passwordInput = $C("input", {
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

		modalInner.appendChild(submitButton);
		modalInner.appendChild(clearButton);

		modalContainer.appendChild(modalInner);
		document.body.appendChild(modalContainer);
	}

	setTimeout(createModal, 3000);
})();