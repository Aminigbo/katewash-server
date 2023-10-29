let { Router } = require("express")
const { GetAllEvents, GetSingleEvent, MakeDonation, CreateEvent, InviteToSupport } = require("./event-controller")

let route = Router()

route.get("/all", GetAllEvents) // Get all active events 

route.get("/single/:id", GetSingleEvent) // Get single active events 


route.post("/donate", MakeDonation) // make donation to events 


route.post("/invite", InviteToSupport) // make donation to events 


route.post("/create", CreateEvent) // make donation to events 

module.exports = route