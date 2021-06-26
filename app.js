const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
require('express-async-errors')
const app = express()
const cors = require('cors')
const noteRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { 
    useNewUrlParser: true,
     useUnifiedTopology: true,
      useFindAndModify: false,
       useCreateIndex: true,
       autoIndex: false,
       poolSize: 10,
       bufferMaxEntries: 0,
       connectTimeoutMS: 0,
       socketTimeoutMS: 0,
       family: 4 })
    .then(() => {
      logger.info('connected to MongoDB')
    })
    .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message)
    })

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use('/api/notes', noteRouter)
app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app