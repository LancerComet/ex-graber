const fs = require('fs')
const process = require('process')
const superAgent = require('superagent')
const cheerio = require('cheerio')
const ora = require('ora')

const visitPicPage = require('./utils/util.visit-pic-page')
const picDownloader = require('./utils/util.pic-downloader')

const COOKIE = require('./cookie.js')
const LINK = process.argv[2]

if (!LINK) {
  console.error('[Error] Page link is not provided. Run as "node app PAGE_LINK"')
  process.exit(1)
}

if (!COOKIE) {
  console.error('[Error] Please set your ex-hentai account cookie in cookie.js first.')
  process.exit(1)
}

console.log(
  `
  ex-Graber By LancerComet at 14:28, 2016.10.01.
  # Carry Your World #
  `
)

const spinners = {
  loadingPage: ora(`Loading ${LINK} ...`)
}

spinners.loadingPage.start()
superAgent
  .get(LINK)
  .set('Cookie', COOKIE)
  .end((err, res) => {
    if (err) {
      spinners.loadingPage.fail()
      throw new Error(`[Error] Access to access ${LINK}: ${err}`)
    }

    spinners.loadingPage.succeed()
    const $ = cheerio.load(res.text)

    // Create Folder.    
    const folderName = $('h1').text()
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
    }

    // Visit all pics and download them all.
    const picPages = Array.prototype.slice.call($('#gdt').find('.gdtm a').map(function () { return $(this).attr("href") }))
    var finished = 0
    picPages.forEach(link => {
      visitPicPage(link).then(imgLink => {
        picDownloader(imgLink, folderName).then(() => {
          finished++
          if (finished === picPages.length) {
            console.log('Finished.')
            process.exit(0)
          }
        })
      })
    })

  })
