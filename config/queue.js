const queue = require('bull')


const redisConfig = {
 port:process.env.REDIS_PORT,
 host:process.env.REDIS_HOST
}


const emailQueue = new queue("userApp",{
    redis:redisConfig
})

module.exports =emailQueue



