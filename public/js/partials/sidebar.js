const sidebarItems = document.querySelectorAll('.sidebar li')

sidebarItems.forEach((item) => {
	if (window.location.origin + window.location.pathname === item.querySelector('a').href) {
		item.classList.add('active')
	}
})
