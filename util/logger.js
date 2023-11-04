const {createLogger, transports, format} = require('winston')

const logger = createLogger({
    level:'info',
    transports:[
        new transports.File({
            filename: 'csye6225.log',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = {logger}