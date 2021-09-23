require('dotenv').config();
const chalk = require('chalk');

const multer = require('multer');
const { getTimeStamp } = require('./getTimeStamp');

const {
  uploadedImageNameGenerator,
  imageIdGenerator,
} = require('./generator');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/buktiKehadiran');
  },
  filename(req, file, cb) {
    cb(null, file.realname);
  },
});

const uploadFileFilter = (req, cb) => {
  const { file } = req;

  if (file.mimetype === 'image/jpeg' && file.originalname.endsWith('.jpeg')) file.extention = '.jpeg';
  else if (file.mimetype === 'image/png' && file.originalname.endsWith('.png')) file.extention = '.png';
  else if (file.mimetype === 'image/jpeg' && file.originalname.endsWith('.jpg')) file.extention = '.jpg';
  else {
    const err = `File type error (must be .PNG / .JPEG / .JPG only and have maximum size of ${process.env.MAX_IMAGE_SIZE_UPLOAD / (1024 * 1024)}MB.)`;
    cb(new Error(err), false);
    return;
  }
  file.realname = `${getTimeStamp()}${uploadedImageNameGenerator()}`.replace(/[/,:, ]/g, '-');
  file.realname = `${file.realname}`.replace(/-/g, '');
  file.realname += file.extention;
  file.id = imageIdGenerator();
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_IMAGE_SIZE_UPLOAD),
  },
  fileFilter: uploadFileFilter,
}).single('photoUpload');

const multerErrorChecker = (res, err) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: `Upload failed. File size exceeds ${process.env.MAX_IMAGE_SIZE_UPLOAD / (1024 * 1024)}MB.` });
    return true;
  } if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
    return true;
  } if (err) {
    console.log(chalk.red(err));
    res.status(500).json({ error: 'Server failure. Please contact admin to resolve.' });
    return true;
  }

  return false;
};

const formSocmedPostValidationStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/socmedPostPicture');
  },
  filename(req, file, cb) {
    cb(null, file.realname);
  },
});

const socmedFormUpload = multer({
  storage: formSocmedPostValidationStorage,
  limits: {
    fileSize: Number(process.env.MAX_IMAGE_SIZE_UPLOAD),
  },
  fileFilter: uploadFileFilter,
}).single('photoUpload');

module.exports = {
  upload,
  socmedFormUpload,
  multerErrorChecker,
};
