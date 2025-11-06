const queue = require('bull')


const redisConfig = {
 port:'6379',
 host:'localhost'
}


const emailQueue = new queue("userApp",{
    redis:redisConfig
})

module.exports =emailQueue



