(async () => {
  const production = process.env.NODE_ENV == 'production'
  const path = require('path')
  const express = require('express')
  const app = express()
  app.enable('trust proxy')
  app.set('views', path.join(__dirname, 'views/'))
  app.set('view engine', 'ejs')

  // app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static(path.join(__dirname, 'public/')))

  const http = require('http')
  const httpServer = http.createServer(app)

  const parse = require('./parse.js')
  app.use('/', async (req, res) => {
    const parsed = await parse.cleanupStations()
    res.render('index.ejs', { stationsStr: JSON.stringify(parsed) })
  })

  const server = await require('./server')(httpServer, parse)

  httpServer.listen(parseInt(process.argv[2]) || 8080)
})()
