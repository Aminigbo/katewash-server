let { Router } = require("express")
const { AddWallet, GetTransactionHistory } = require("./payment-controller")

let route = Router()

route.post("/add-wallet", AddWallet) // 
route.get("/transaction-history/:user", GetTransactionHistory) // 


module.exports = route