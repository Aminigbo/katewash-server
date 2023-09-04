let { Router } = require("express")  
const { AddWallet } = require("./payment-controller")

let route = Router()

route.post("/add-wallet", AddWallet ) // 


module.exports = route