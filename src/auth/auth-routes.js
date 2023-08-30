let { Router } = require("express")
const { LoginController, SignUpController,RequestOtpController, ResetPasswordController } = require("./auth-controllers")

let route = Router()

route.post("/signup", SignUpController)
route.post("/signin", LoginController)
route.post("/requet-otp", RequestOtpController)
route.post("/ResetPWD", ResetPasswordController)  



module.exports = route