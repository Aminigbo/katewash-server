const { FetchMetaData, UpdateWalletModel, UpdateWallet } = require("../auth/auth-models");
const { AddWalletModel, FetchUsersTransactionHistoryService } = require("./payment-model");

function AddWallet(req, res) {
    let { payref, user, amount } = payload = req.body;

    if (!payref || !user || !amount) {
        res.send({
            success: false,
            message: "Invalid payload",
            data: [],
        })
    } else {

        AddWalletModel({
            ...payload,
            type: "Wallet top-up"
        })
            .then(response => {
                if (response.error != null) {
                    res.send({
                        success: false,
                        message: "An error occured",
                        data: response,
                    })
                } else {
                    FetchMetaData(user)
                        .then(response2 => {
                            if (response2.error != null) {
                                res.send({
                                    success: false,
                                    message: "An error occured",
                                    data: response2,
                                })
                            } else {
                                let newAmount = parseInt(amount) + parseInt(response2.data[0].wallet);
                                let email = response2.data[0].email

                                UpdateWallet({ uuid: user, wallet: newAmount })
                                    .then(resp => {

                                        UpdateWalletModel({
                                            amount: newAmount,
                                            email: email
                                        })
                                            .then(response3 => {
                                                if (response3.error != null) {
                                                    res.send({
                                                        success: false,
                                                        message: "An error occured",
                                                        data: response3,
                                                    })
                                                } else {
                                                    res.send({
                                                        success: true,
                                                        message: "Wallet updated",
                                                        data: response3.data[0],
                                                    })
                                                }
                                            })
                                            .catch(error => {
                                                res.send({
                                                    success: false,
                                                    message: "An error occured",
                                                    data: error,
                                                })
                                            })
                                    })


                            }

                            // res.send(response2)

                        })
                        .catch(error => {
                            res.send({
                                success: false,
                                message: "An error occured",
                                data: error,
                            })
                        })
                }
            })
            .catch(error => {
                res.send({
                    success: false,
                    message: "An error occured",
                    data: error,
                })
            })
    }
}


function GetTransactionHistory(req, res) {
    let { uuid } = req.params;
    FetchUsersTransactionHistoryService(uuid)
        .then(response => {
            if (response.error != null) {
                res.send({
                    success: false,
                    message: "An error occured",
                    data: [],
                })
            } else {
                FetchMetaData(uuid)
                    .then(resp2 => {

                        res.send({
                            success: true,
                            message: "Fetched",
                            data: response.data,
                            wallet:resp2.data[0].wallet
                        })
                    })
            }
        })
        .catch(error => {
            res.send({
                success: false,
                message: "An error occured",
                data: [],
            })
        })
}
module.exports = {
    AddWallet,
    GetTransactionHistory
}