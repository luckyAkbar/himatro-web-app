const { app } = require('./src/app')

app.listen(4000, () => {
  console.log('Server estabilised on port 4000')
})

app.on('exit', () => {
  app.close()
})
