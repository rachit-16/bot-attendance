const submitFormData = (form, url, ...options) => {
	const formData = Object.fromEntries(new FormData(form))

	fetch(url, {
		method: options.method || 'POST',
		body: JSON.stringify(formData),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((res) => (window.location = res.url))
		.catch((error) => console.error(error))
}

document.getElementById('add-participant-btn').addEventListener('click', function () {
	const addParticipantPopup = document.getElementById('add-participant-popup')
	addParticipantPopup.style.display = 'flex'

	document.querySelector('.close-add').addEventListener('click', function () {
		addParticipantPopup.style.display = 'none'
	})

	const meetingId = window.location.href.split('/').reverse()[0]
	const addParticipantForm = document.getElementById('add-participant-form')
	const url = `http://localhost:3000/api/user/meetings/${meetingId}/addParticipant`

	addParticipantForm.addEventListener('submit', (event) => {
		event.preventDefault()
		submitFormData(addParticipantForm, url)
		// const formData = Object.fromEntries(new FormData(addParticipantForm))

		// fetch(`http://localhost:3000/api/user/meetings/${meetingId}/addParticipant`, {
		// 	method: 'POST',
		// 	body: JSON.stringify(formData),
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// })
		// 	.then((res) => (window.location = res.url))
		// 	.catch((error) => console.error(error))
	})
})

// SEARCH
const search = (event) => {
	let value = event.target.value.toLowerCase()
	let tab = document.querySelector('.table table')
	let tr = tab.querySelectorAll('tr')

	for (var i = 0; i < tr.length; ++i) {
		let td = tr[i].getElementsByTagName('td')[0]
		if (td) {
			let textvalue = td.textContent || td.innerHTML

			if (textvalue.toLowerCase().indexOf(value) > -1) {
				tr[i].style.display = ''
			} else {
				tr[i].style.display = 'none'
			}
		}
	}
}
