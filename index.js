<<<<<<< HEAD
require('dotenv').config()
const { testQuery } = require('./db/connection')
const { app } = require('./src/app')
=======
require('dotenv').config();
const { app } = require('./src/app');
>>>>>>> 81f8ee3fc5dd4fb2d691783fe68b79a8b849b7e1

app.on('exit', () => {
  console.log('app closed unexpectedly');
  app.close();
});

app.on('error', () => {
  console.log('app closed unexpectedly1');
  app.close();
});

app.on('uncaughtException', () => {
  console.log('app closed unexpectedly');
  app.close();
});

app.on('EADDRINUSE', () => {
  console.log('Restarting due to address error');
  process.exit(-1);
});

app.listen(process.env.PORT || process.env.SERVER_PORT, () => {
  console.log(`Server estabilised on port ${process.env.PORT || process.env.SERVER_PORT}`)
  //console.log(`On DATABASE: ${process.env.PGDATABASE}`)
})
