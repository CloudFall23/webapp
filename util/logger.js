// const {createLogger, transports, format} = require('winston')

// const logger = createLogger({
//     level:'info',
//     transports:[
//         new transports.File({
//             filename: 'csye6225.log',
//             format: format.combine(format.timestamp(), format.json())
//         })
//     ]
// })

// module.exports = {logger}

const { createLogger, format, transports } = require('winston')
 
const { combine, timestamp, printf, splat } = format
const appRoot = require('app-root-path')
 
const myFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${
    meta ? JSON.stringify(meta) : ''
  }`
})
 
const logger = createLogger({
  format: combine(timestamp(), splat(), myFormat),
  transports: [
    new transports.File({ filename: `${appRoot}/csye6225.log` }),
    new transports.Console(),
  ],
})
 
module.exports = logger