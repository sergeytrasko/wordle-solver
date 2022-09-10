import puppeteer from 'puppeteer'

import { readWords } from './words.js'
import { Session } from './session.js'
import { feedback } from './feedback.js'

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.goto('https://www.nytimes.com/games/wordle/index.html')

    await page.waitForSelector('#pz-gdpr-btn-accept')

    const acceptButton = await page.$('#pz-gdpr-btn-accept')
    await acceptButton.click()

    await page.waitForSelector('[class^="Modal-module_closeIcon"]')
    const closeIcon = await page.$('[class^="Modal-module_closeIcon"]')
    await closeIcon.click()

    const words = await readWords()
    const session = new Session(words)
    for (let attempt = 1; ; attempt++) {
        let word = session.getWord()
        console.log(`Attempt ${attempt}: trying word ${word}`)
        await page.keyboard.type(word + '\n')
        await page.waitForTimeout(3 * 1000)        
        const rows = Array.from(await page.$$('[class^="Row-module_row"]'))
        const row = rows[attempt-1]
        const fb = Array.from(await row.$$eval('[class^=Tile-module_tile]', el => el.map(x => x.getAttribute('data-state'))))
        if (fb[0] == 'tbd') {
            //no such word, do another attempt
            attempt--
            for (let i = 0; i < 5; i++) {
                await page.keyboard.press('Backspace')
            }
            continue
        }
        session.giveFeedback(word, fb)
        if (!fb.find(f => f != feedback.CORRECT_SPOT)) {
            console.log(`Today's word is ${word}`)
            break
        }
    }
    await page.waitForTimeout(5 * 1000)
    await browser.close()
})()