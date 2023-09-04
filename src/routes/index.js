let { Router } = require("express")

let route = Router()


// firebase Push notification
route.use("/firebase", require("../firebase/route.js"))


// authentication
route.use("/auth", require("../auth/auth-routes.js")) 

// Jobs
route.use("/schedules", require("../schedules/schedule-route.js")) 



// notification
route.use("/notification", require("../notification/notification-routes.js")) 
 

module.exports = route