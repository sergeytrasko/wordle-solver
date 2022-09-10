import { readWords } from './words.js'
import { Session } from './session.js'
import { feedback } from './feedback.js'

(async () => {
    const runs = 100
    let totalAttempts = 0
    for (let run = 0; run < runs; run++) {
        const words = await readWords()
        const session = new Session(words)
        const check = (target, w) => {
            const res = []
            for (let i = 0; i < w.length; i++) {
                let r = feedback.WRONG
                if (target[i] == w[i]) {
                    r = feedback.CORRECT_SPOT
                } else if (target.indexOf(w[i]) >= 0) {
                    r = feedback.DIFFERENT_SPOT
                }
                res.push(r)
            }
            return res
        }
        const done = (res) => {
            for (let i = 0; i < 5; i++) {
                if (res[i] != feedback.CORRECT_SPOT) return false
            }
            return true
        }
        const target = words[Math.floor(Math.random() * words.length)]
        for (let attempt = 1; ; attempt++) {
            let word = session.getWord()
            // console.log(`Attempt ${attempt}: ${word}`)
            const fb = check(target, word)
            session.giveFeedback(word, fb)
            if (done(fb)) {
                totalAttempts+=attempt
                break
            }
        }
    }
    console.log(`Used ${totalAttempts/runs} attempts in average`)
})()