let { Router } = require("express") 
const { GetAllNotifictionsController } = require("./notification-controllers")

let route = Router()

route.get("/all/:user", GetAllNotifictionsController ) // 


module.exports = route