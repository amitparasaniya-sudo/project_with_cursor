const {createClient} = require("redis")


const redisClient = createClient({
    url:`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD
}) 
console.log(/redisClient/,redisClient)


module.exports =redisClient