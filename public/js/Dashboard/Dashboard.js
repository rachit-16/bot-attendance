const viewMeetingBtn = document.getElementById('view_meeting')
const editMeetingBtn = document.getElementById('edit_meeting')
const deleteMeetingBtn = document.getElementById('delete_meeting')
const addNewMeetingBtn = document.getElementById('add-new-meeting-btn')

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

// VIEW MEETING
const viewMeetingHandler = (event) => {
	const meetingRow = event.target.parentElement.parentElement
	const meetingId = meetingRow.getAttribute('id')
	fetch(`http://localhost:3000/api/user/meetings/details/${meetingId}`)
		.then((res) => (window.location = res.url))
		.catch((error) => console.error(error))
}

// EDIT MEETING
const editMeetingHandler = (event) => {
	const meetingRow = event.target.parentElement.parentElement
	const meetingId = meetingRow.getAttribute('id')
	const editMeetingPopup = document.getElementById('edit-meeting-popup')

	editMeetingPopup.style.display = 'flex'

	document.querySelector('.close-edit').addEventListener('click', function () {
		editMeetingPopup.style.display = 'none'
	})

	const editForm = document.getElementById('edit-form')
	const url = `http://localhost:3000/api/user/meetings/edit/${meetingId}`

	editForm.addEventListener('submit', (event) => {
		event.preventDefault()
		submitFormData(editForm, url)
		// 	const formData = Object.fromEntries(new FormData(editForm))

		// 	fetch(url, {
		// 		method: 'POST',
		// 		body: JSON.stringify(formData),
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 	})
		// 		.then((res) => (window.location = res.url))
		// 		.catch((error) => console.error(error))
	})
}

// DELETE MEETING
const deleteMeetingHandler = (event) => {
	const meetingRow = event.target.parentElement.parentElement
	const meetingId = meetingRow.getAttribute('id')
	const confirm = window.confirm('Are you sure you want to delete this meeting record?')
	if (!confirm) {
		return
	}

	fetch(`http://localhost:3000/api/user/meetings/delete/${meetingId}`, {
		method: 'DELETE',
	})
		.then((res) => (window.location = res.url))
		.catch((error) => console.error(error))
}

// NEW MEETING
addNewMeetingBtn.addEventListener('click', () => {
	const newMeetingPopup = document.getElementById('new-meeting-popup')
	newMeetingPopup.style.display = 'flex'

	document.querySelector('.close-new').addEventListener('click', function () {
		newMeetingPopup.style.display = 'none'
	})

	const newMeetingForm = document.getElementById('new-meeting-form')
	const url = 'http://localhost:3000/api/user/meetings/new'

	newMeetingForm.addEventListener('submit', (event) => {
		event.preventDefault()
		submitFormData(newMeetingForm, url)
		// const formData = Object.fromEntries(new FormData(newMeetingForm))
		// let redirect
		// fetch(url, {
		// 	method: 'POST',
		// 	body: JSON.stringify(formData),
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// })
		// 	.then((res) => (redirect = res.url))
		// 	.catch((error) => console.error(error))
	})
})
