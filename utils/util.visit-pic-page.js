/**
 *  Function for visiting picture detail page.
 *  @param { String } pageLink - Url of the page that providing original picture.
 *  @return { Promise } - The promise function for handling result.
 */

const superAgent = require('superagent')
const cheerio = require('cheerio')
const COOKIE = require('../cookie')
const ora = require('ora')

module.exports = function (pageLink) {
  return new Promise((resolve, reject) => {
    const spinner = ora(`Going to access to page ${pageLink} ...`).start()
    superAgent
      .get(pageLink)
      .set('Cookie', COOKIE)
      .end((err, res) => {
        if (err) {
          console.warn(`[Warn] Cann't access to ${pageLink}.`)
          spinner.fail()
          reject(err)
        }

        if (!res.text) {
          console.warn(`[Warn] Didn't response correctly. ${pageLink} was skipped.`)
          spinner.fail()
          reject()
        }
        
        const $ = cheerio.load(res.text)
        const imgLink = $('#img').attr('src')

        spinner.succeed()
        resolve(imgLink)
      })
  })

}
