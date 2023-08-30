let { Router } = require("express")
const { CreateScheduleController } = require("./schedule-controller")

let route = Router()

route.post("/create-schedule", CreateScheduleController) // create schedule

module.exports = route