const chalk = require('chalk')

const { testQuery } = require('../../db/connection')
const { refIdValidator } = require('../util/validator')

const imageViewHandler = async (req, res) => {
  const { imageId } = req.params

  const isImageIdValid = refIdValidator(imageId)

  if (!isImageIdValid) {
    res.status(400).render('errorPage', {
      errorMessage: 'Image ID invalid.'
    })
    return
  }

  let option = {
    root: process.env.SDM_UPLOADED_IMAGE_PATH,
    dotfiles: 'deny',
    headers: {}
  }

  const query = `SELECT * FROM gambar
    WHERE gambar_id = $1`
  const params = [imageId]

  try {
    const { rows, rowCount } = await testQuery(query, params)
    const [{gambar_id, nama_gambar}] = rows

    if (rowCount === 0) {
      res.status(404).render('errorPage', {
        errorMessage: 'Image not found. Please contact admin if you think this is a mistake'
      })
      return
    }

    if (String(rows.nama_gambar).endsWith('.png')) {
      option.headers = {
        'Content-Type': 'image/png'
      }
    } else if (String(rows.nama_gambar).endsWith('.jpeg')) {
      option.headers = {
        'Content-Type': 'image/jpeg'
      }
    }

    res.sendFile(nama_gambar, option, (err) => {
      if (err) {
        console.log(chalk.red(err))
        res.status(500).render('errorPage', {
          errorMessage: 'Server Error. Please contact admin to resolve.'
        })
      }
    })
  } catch (e) {
    console.log(chalk.red(e))
    res.status(404).render('errorPage', {
      errorMessage: 'Image not found.'
    })
  }
}

module.exports = { imageViewHandler }
