const loginButton = document.querySelector('#login')
const usernameInput = document.querySelector('#login_username')
const passwordInput = document.querySelector('#login_password')
const toSignup = document.querySelector('#create_a_new_account')

loginButton.addEventListener('click', () => {
	const username = usernameInput.value
	const password = passwordInput.value
	fetch('http://localhost:3000/api/auth/login', {
		method: 'POST',
		body: JSON.stringify({
			username: username,
			password: password,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((res) => (window.location = res.url))
		.catch((error) => console.error(error))
})

toSignup.addEventListener('click', () => {
	window.location = 'http://localhost:3000/api/auth/signup'
})
