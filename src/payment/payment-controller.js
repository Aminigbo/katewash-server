const { FetchMetaData, UpdateWalletModel } = require("../auth/auth-models");
const { AddWalletModel } = require("./payment-model");

function AddWallet(req, res) {
    let { payref, user, amount } = payload = req.body;

    if (!payref || !user || !amount) {
        res.send({
            success: false,
            message: "Invalid payload",
            data: [],
        })
    } else {

        AddWalletModel(payload)
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
                                    message: "XX=====An error occured",
                                    data: response2,
                                })
                            } else {
                                let newAmount = parseInt(amount) + parseInt(response2.data[0].wallet);
                                let email = response2.data[0].email
                                UpdateWalletModel({
                                    amount: newAmount,
                                    email: email
                                })
                                    .then(response3 => {
                                        if (response3.error != null) {
                                            res.send({
                                                success: false,
                                                message: "X====An error occured",
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
                                            message: "XZ====An error occured",
                                            data: error,
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

module.exports = {
    AddWallet
}