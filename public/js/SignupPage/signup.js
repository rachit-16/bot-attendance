const nameInput = document.querySelector('#Name')
const emailInput = document.querySelector('#Email')
const usernameInput = document.querySelector('#UserName')
const passwordInput = document.querySelector('#Password')
const password2Input = document.querySelector('#Confirm_Password')
const signupButton = document.querySelector('#signup')
const toSignin = document.querySelector('#sign_in')

signupButton.addEventListener('click', () => {
	const name = nameInput.value
	const email = emailInput.value
	const username = usernameInput.value
	const password = passwordInput.value
	const password2 = password2Input.value

	fetch('http://localhost:3000/api/auth/signup', {
		method: 'POST',
		body: JSON.stringify({
			name,
			email,
			username,
			password,
			password2,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((res) => (window.location = res.url))
		.catch((error) => console.error(error))
})

toSignin.addEventListener('click', () => {
	window.location = 'http://localhost:3000/api/auth/login'
})
