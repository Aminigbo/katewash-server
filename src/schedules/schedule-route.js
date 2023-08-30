let { Router } = require("express")
const { CreateScheduleController, GetAllUserSchedules, GetSingleUserSchedules } = require("./schedule-controller")

let route = Router()

route.post("/create-schedule", CreateScheduleController) // create schedule

route.get("/all/:uuid", GetAllUserSchedules) // all schedule

route.get("/single/:uuid/:id", GetSingleUserSchedules) // single schedule

module.exports = route