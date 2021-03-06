(($: <ElementType extends HTMLElement>(id: string) => ElementType) => {
	const passwordStorageKey = "password_cache";
	
	const form = $<HTMLFormElement>("form");
	const fileInput = $<HTMLInputElement>("file");
	const passwordInput = $<HTMLInputElement>("password");
	const passwordVisbilityButton = $<HTMLButtonElement>("password-visibility");
	const submitButton = $<HTMLButtonElement>("submit");

	// Password Cache
	const storedPassword = localStorage.getItem(passwordStorageKey);
	if (storedPassword) {
		passwordInput.value = storedPassword;
	}

	// Password Visbility
	passwordVisbilityButton.addEventListener("click", ev => {
		ev.preventDefault();

		if (passwordInput.type === "password") {
			passwordInput.type = "text";
		} else {
			passwordInput.type = "password"
		}
	});

	// on Submit Event
	form.addEventListener("submit", ev => {
		ev.preventDefault();
		
		const data = new FormData(form);

		const submitData: KioskTypes.OpenObject = {
			path: (data.get("file") as File).path,
			password: data.get("password") as string
		}

		localStorage.setItem(passwordStorageKey, submitData.password);

		kiosk_app.show(submitData);
	});

})(document.getElementById.bind(document))