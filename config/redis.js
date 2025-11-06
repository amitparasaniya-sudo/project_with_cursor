const {createClient} = require("redis")


const redisClient = createClient({
    url:`redis://localhost:6379`,
    password:''
}) 
console.log(/redisClient/,redisClient)


module.exports =redisClient