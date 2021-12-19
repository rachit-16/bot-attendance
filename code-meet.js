let c = ''
let dateMeet = ''

dateMeet += new Date().toLocaleString('en-US')

document.querySelector('button[aria-label="Show everyone"]').click()

let allParticipants = document.querySelectorAll('div[class="KV1GEc"][role="listitem"]')

let taker = allParticipants[0].innerText.split('\n')[0]
let idx = taker.indexOf('(You)')

if (idx !== -1) {
  taker = taker.substr(0, idx)
}

let you = allParticipants[allParticipants.length - 1].innerText.split('\n')[0]
idx = you.indexOf('Meeting Host')

if (idx !== -1) {
  you = you.substr(0, idx)
}

c += you + '@'

for (var i = 0; i < allParticipants.length - 1; i++) {
  var attendee = allParticipants[i].innerText.split('\n')[0]
  let idx = attendee.indexOf('(You)')

  if (idx !== -1) {
    attendee = attendee.substr(0, idx)
    c += attendee + '@'
    continue
  }

  idx = attendee.indexOf('devicespriority_high')
  if (idx !== -1) {
    attendee = attendee.substr(0, idx)
    c += attendee + '@'
    continue
  }
  c += attendee + '@'
}

function copyToClipboard(text) {
  var dummy = document.createElement('textarea')
  document.body.appendChild(dummy)
  dummy.value = text
  dummy.select()
  document.execCommand('copy')
  document.body.removeChild(dummy)
}

copyToClipboard(c)

var iframe = document.createElement('IFRAME')
iframe.setAttribute('name', 'formTarget')
iframe.setAttribute('style', 'display:none')

var form = document.createElement('FORM')
form.setAttribute('method', 'post')
form.setAttribute(
  'action',
  'https://dtu-attendance.herokuapp.com/username/${username}/password/${password}/save'
)
form.setAttribute('target', 'formTarget')

const setForm = (form, attr) => {
  const input = document.createElement('input')
  Object.keys(attr).forEach((key) => {
    input.setAttribute(key, attr[key])
  })
  form.appendChild(input)
}

setForm(form, { type: 'hidden', name: 'you', value: you })
setForm(form, { type: 'hidden', name: 'taker', value: taker })
setForm(form, { type: 'hidden', name: 'date', value: dateMeet })
setForm(form, { type: 'hidden', name: 'data', value: c })
setForm(form, { type: 'hidden', name: 'url', value: window.location.href })

document.body.appendChild(form)
form.submit()
