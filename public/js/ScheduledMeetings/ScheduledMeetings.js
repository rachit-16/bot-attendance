const viewMeetingBtn = document.getElementById('view_meeting')
const editMeetingBtn = document.getElementById('edit_meeting')
const deleteMeetingBtn = document.getElementById('delete_meeting')
const addNewMeetingBtn = document.getElementById('add-new-meeting-btn')
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
	const url = `/api/user/meetings/edit/${meetingId}`

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

	fetch(`/api/user/meetings/delete/${meetingId}`, {
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
	const url = '/api/user/meetings/new'

	newMeetingForm.addEventListener('submit', (event) => {
		event.preventDefault()
		submitFormData(newMeetingForm, url)
	})
})

// SEARCH DASHBOARD
const searchDashboard = async (event) => {
	if (event.keyCode === 13) {
		const value = event.target.value.toLowerCase()
		const topic = searchBarTopic.value
		if (!value) {
			return
		}
		window.location = `/api/user/meetings?search=${topic}:${value}&scheduled=true`
	}
}

// PAGINATION
const prev = document.querySelector('.pagination li.prev')
const next = document.querySelector('.pagination li.next')
const pages = document.querySelectorAll('.pagination li.num')
const pageLimit = 6

const getParams = () => Object.fromEntries(new URLSearchParams(window.location.search))

const getCurrentPage = () => {
	const { limit, skip } = getParams()
	return skip / limit || 0
}

const gotoPage = (pageNo, search) => {
	let url = `/api/user/meetings?scheduled=true&limit=${pageLimit}&skip=${
		pageLimit * pageNo
	}`

	if (search) {
		url += `&search=${search}`
	}

	window.location = url
}

prev.addEventListener('click', async () => {
	let currentPage = getCurrentPage()
	const { search } = getParams()
	if (currentPage === 0) {
		return
	}
	console.log('cp: ', currentPage)
	gotoPage(currentPage - 1, search)
})

next.addEventListener('click', async () => {
	let currentPage = getCurrentPage()
	const { search } = getParams()
	console.log('cp: ', currentPage)
	gotoPage(currentPage + 1, search)
})

pages.forEach((page, idx) => {
	page.addEventListener('click', () => {
		let currentPage = getCurrentPage()
		const { search } = getParams()
		console.log('cp: ', currentPage)
		gotoPage(idx, search)
	})
})
