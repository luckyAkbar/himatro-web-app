require('dotenv').config();
const { mongodbAtlasConnection } = require('./db/mongodb-connection');
const { app } = require('./src/app');

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

app.listen(process.env.SERVER_PORT, async () => {
  try {
    await mongodbAtlasConnection();
  } catch (e) {
    console.log(e);
  }

  console.log('Server estabilised on port', process.env.SERVER_PORT);
  console.log(`On DATABASE: ${process.env.PGDATABASE}`);
});
