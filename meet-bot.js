console.log('bot Went', process.argv)

let startTime = new Date()
let endTime = new Date()

const puppeteerExtra = require('puppeteer-extra')
const stealthPlugin = require('puppeteer-extra-plugin-stealth')
const puppeteer = require('puppeteer')
const dotenv = require('dotenv')

dotenv.config()

async function meetbot(meetLink) {
	try {
		console.log('meet bot started ; ', meetLink)

		puppeteerExtra.use(stealthPlugin())
		const browser = await puppeteerExtra.launch({ headless: false })

		// const contextIncognito = await browser.createIncognitoBrowserContext();
		// const page = await contextIncognito.newPage();
		const page = await browser.newPage()

		// Login to google

		await page.goto('https://accounts.google.com/signin/v2/identifier')
		await page.type('[type="email"]', process.env.gmailUsername)
		await page.click('#identifierNext')
		await page.waitForTimeout(3000)

		await page.type('[type="password"]', process.env.password)
		await page.click('#passwordNext')

		await page.waitForTimeout(3000)

		const context = browser.defaultBrowserContext()
		context.overridePermissions(meetLink, [
			'camera',
			'microphone',
			'clipboard-read',
			'clipboard-write',
		])

		await page.goto(meetLink)

		await page.waitForTimeout(5000)

		// await page.evaluate(() => {
		//     document.querySelector('#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.vdySc.pMgRYb.Up8vH.J9Nfi.iWO5td > div.XfpsVe.J9fJmf > div').click();
		// });

		// console.log("clicked dismiss");

		await page.waitForTimeout(2000)

		await page.keyboard.down('Control')
		await page.keyboard.press('KeyD')
		await page.keyboard.press('KeyE')
		await page.keyboard.up('Control')

		// ask to join

		await page.evaluate(() => {
			document
				.querySelector(
					'#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div > div.d7iDfe.NONs6c > div > div.Sla0Yd > div > div.XCoPyb > div.uArJ5e.UQuaGc.Y5sE8d.uyXBBb.xKiqt > div.e19J0b.CeoRYc'
				)
				.click()
		})

		console.log('Asked to join')

		// check when entered in the meeting

		await page
			.waitForSelector(
				'#ow3 > div.T4LgNb > div > div:nth-child(9) > div.crqnQb > div.DAQYgc.xPh1xb.P9KVBf > div.MaVIwe > div.Ok4Bg > div > div > div:nth-child(2) > span > button > i.google-material-icons.VfPpkd-kBDsod.NtU4hc',
				[{ timeout: 300000 }]
			)
			.then(async () => {
				console.log('in the meeting')

				await page.evaluate(() => {
					// script to be run in console when entered in the meet
					// let c = ''
					// document.querySelector('button[aria-label="Show everyone"]').click()
					// setTimeout(() => {
					// 	const divList = document.querySelectorAll('.KV1GEc')
					// 	const allParticipants = document.querySelectorAll('span[class="ZjFb7c"]')
					// 	const isPresenting =
					// 		divList[divList.length - 1].innerText.indexOf('Presentation') !== -1
					// 	const you = allParticipants[0].innerText
					// 	const taker =
					// 		allParticipants[allParticipants.length - (isPresenting ? 2 : 1)].innerText
					// 	c += you + '@'
					// 	for (let i = 1; i < allParticipants.length - (isPresenting ? 2 : 1); i++) {
					// 		let attendee = allParticipants[i].innerText
					// 		c += attendee + '@'
					// 	}
					// 	function copyToClipboard(text) {
					// 		const dummy = document.createElement('textarea')
					// 		document.body.appendChild(dummy)
					// 		dummy.value = text
					// 		dummy.select()
					// 		document.execCommand('copy')
					// 		document.body.removeChild(dummy)
					// 	}
					// 	copyToClipboard(c)
					// 	const iframe = document.createElement('IFRAME')
					// 	iframe.setAttribute('name', 'formTarget')
					// 	iframe.setAttribute('style', 'display:none')
					// 	const form = document.createElement('FORM')
					// 	form.setAttribute('method', 'post')
					// 	form.setAttribute('action', 'http://localhost:3000/api/attendance/botID')
					// 	form.setAttribute('target', 'formTarget')
					// 	const setForm = (attr) => {
					// 		const input = document.createElement('input')
					// 		Object.keys(attr).forEach((key) => {
					// 			input.setAttribute(key, attr[key])
					// 		})
					// 		form.appendChild(input)
					// 	}
					// 	console.log(you)
					// 	setForm({ type: 'hidden', name: 'you', value: you })
					// 	setForm({ type: 'hidden', name: 'taker', value: taker })
					// 	setForm({ type: 'hidden', name: 'date', value: new Date().toLocaleDateString() })
					// 	setForm({ type: 'hidden', name: 'time', value: new Date().toLocaleTimeString() })
					// 	setForm({ type: 'hidden', name: 'data', value: c })
					// 	setForm({ type: 'hidden', name: 'url', value: window.location.href })
					// 	document.body.appendChild(form)
					// 	form.submit()
					// }, 50)
				})

				await page.waitForTimeout(250000)

				await browser.close()

				endTime = new Date()

				return {
					entryStatus: true,
					meetLink: meetLink,
					time: endTime.getTime() - startTime.getTime(),
				}
			})
			.catch(async () => {
				console.log('not in the meeteing')
				await browser.close()

				endTime = new Date()

				return {
					entryStatus: false,
					meetLink: meetLink,
					time: endTime.getTime() - startTime.getTime(),
				}
			})

		await page.waitForTimeout(5000)

		await browser.close()
	} catch (error) {
		console.log(error)
	}
}

// meetbot(process.argv[2])

process.on('message', async (message) => {
	console.log('MESSAGE::', message)
	try {
		const jsonResponse = await meetbot(message.link)
		// process.send(jsonResponse)
	} catch (err) {
		console.log(err)
	}
	process.exit()
})
