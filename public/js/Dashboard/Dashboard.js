const viewMeetingBtn = document.getElementById('view_meeting')
const editMeetingBtn = document.getElementById('edit_meeting')
const deleteMeetingBtn = document.getElementById('delete_meeting')
const addNewMeetingBtn = document.getElementById('add-new-meeting-btn')
const searchBarInput = document.querySelector('div.dropdown input')
const searchBarTopic = document.querySelector('div.dropdown select#heading')

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
	})
})

// SEARCH DASHBOARD
let Meetings = []
const searchDashboard = async (event) => {
	if (!Meetings || Meetings.length === 0) {
		Meetings = await fetch('http://localhost:3000/api/user/meetings')
			.then((data) => data.json())
			.catch((error) => console.log(error))
	}

	const search = (topic, value) => {
		return Meetings.filter((meeting) => {
			if (topic === 'participantsCount') {
				return meeting[topic] === +value
			}
			return meeting[topic].toLowerCase().includes(value.toLowerCase())
		})
	}

	const value = event.target.value
	const topic = searchBarTopic.value
	const filteredMeetings = search(topic, value)
	console.log(filteredMeetings)
}
