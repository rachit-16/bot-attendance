const sidebarItems = document.querySelectorAll('.sidebar li')

sidebarItems.forEach((item) => {
	if (window.location.href === item.querySelector('a').href) {
		item.classList.add('active')
	}
})
