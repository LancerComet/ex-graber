/**
 *  Function for picture downloading.
 *  @param { String } imgURL - Url of the target picture.
 *  @return { Promise } - The promise function for handling result.
 */

const fs = require('fs')
const superAgent = require('superagent')
const ora = require('ora')

module.exports = function (imgURL, folderName) {
  return new Promise((resolve, reject) => {
    const spinner = ora(`[Log] Downloading ${imgURL} ...`)
    superAgent
      .get(imgURL)
      .end((err, res) => {
        if (err) {
          console.error('[Error] Failed to download ${imgURL} : ${err}')
          spinner.fail()
          reject(err)
        }

        const fileName = imgURL.substr(imgURL.lastIndexOf('/') + 1, imgURL.length)
        
        fs.writeFile(folderName + '/' + fileName, res.body, function () {
          console.log(`[Success] Picture ${fileName} has been saved.`)
          spinner.succeed()
          resolve(true)
        })
      })
  })
}
