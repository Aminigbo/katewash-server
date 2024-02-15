const { FetchMetaData, UpdateWalletModel, UpdateWallet } = require("../auth/auth-models");
const { AddNotifictionsController } = require("../notification/notification-controllers");
const { CurrentDate } = require("../utilities");
const { CreateSceduleModel, GetAllUserSchedulesModel, GetSingleUserSchedulesModel, UpdateScheduleModel, GetSingleSchedulesModelyId } = require("./schedule-model");

function CreateScheduleController(req, res) {
    let { vehicleType, vehicleColor, plateNumber, subscription, uuid, address } = payload = req.body;

    if (!vehicleType || !vehicleColor || !plateNumber || !subscription || !uuid || !address) {
        res.send({
            success: false,
            message: "Provide all payload",
            data: [],
        })
    } else {

        // check if user's wallet blance is >= subscription amount
        FetchMetaData(uuid)
            .then(response => {
                console.log(response)
                let Wallet = response.data[0].wallet;
                let Email = response.data[0].email;
                let Amount = subscription.amount;
                if (Wallet < Amount) {
                    res.send({
                        success: false,
                        message: "Insufficient wallet balance",
                        data: [],
                    })
                } else {
                    // subtract the schedule amount from wallet
                    let newAmount = parseInt(Wallet) - parseInt(Amount);
                    UpdateWalletModel({ email: Email, amount: newAmount })
                        .then(response => {
                            UpdateWallet({ wallet: newAmount, uuid })
                                .then(resp2 => {
                                    CreateSceduleModel(payload)
                                        .then(response => {
                                            if (response.error != null) {
                                                res.send({
                                                    success: false,
                                                    message: "An error occured",
                                                    data: [],
                                                })
                                            } else {
                                                res.send({
                                                    success: true,
                                                    message: "Schedule create",
                                                    data: response.data[0],
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
                                })
                        })
                }

            })

    }
}

function GetAllUserSchedules(req, res) {
    let { uuid } = req.params;
    if (!uuid) {
        res.send({
            success: false,
            message: "Invalid user",
            data: [],
        })
    } else {
        GetAllUserSchedulesModel(uuid)
            .then(response => {
                if (response.error != null) {
                    res.send({
                        success: false,
                        message: "An error occured",
                        data: [],
                    })
                } else {
                    res.send({
                        success: true,
                        message: "Fetched successfully",
                        data: response.data,
                    })
                }
            })
    }

}

function GetSingleUserSchedules(req, res) {
    let { uuid, id } = payload = req.params;
    if (!uuid || !id) {
        res.send({
            success: false,
            message: "Invalid payload",
            data: [],
        })
    } else {
        GetSingleUserSchedulesModel(payload)
            .then(response => {
                console.log(response)
                if (response.error != null) {
                    res.send({
                        success: false,
                        message: "An error occured",
                        data: [],
                    })
                } else if (response.data.length < 1) {
                    res.send({
                        success: false,
                        message: "Invalid schedule",
                        data: null,
                    })
                } else {
                    res.send({
                        success: true,
                        message: "Fetched successfully",
                        data: response.data[0],
                    })
                }
            })
    }

}

function UpdateScheduleController(req, res) {
    let { id, status } = req.body;

    if (!id || !status) {
        res.send({
            success: false,
            message: "Invalid payload",
            data: [],
        })
    } else {
        GetSingleSchedulesModelyId(id)
            .then(response => {
                if (response.error != null) {
                    console.log(response)
                    res.send({
                        success: false,
                        message: "An error occured",
                        data: [],
                    })
                } else if (response.data.length < 1) {
                    res.send({
                        success: false,
                        message: "No schedule found",
                        data: [],
                    })
                } else {
                    let message = ""
                    let tracking = {}
                    if (status == "confirmed") {
                        message = `Your wash schedule for ${response.data[0].data.vehicleType} with plate number ${response.data[0].data.plateNumber} have been confirmed.`;
                        tracking = {
                            ...response.data[0].tracking,
                            confirmed: true,
                        }
                    } else if (status == "processed") {
                        message = `Your wash schedule for ${response.data[0].data.vehicleType} with plate number ${response.data[0].data.plateNumber} have been processed.`;
                        tracking = {
                            ...response.data[0].tracking,
                            processed: true
                        }
                    } else if (status == "completed") {
                        message = `Your wash schedule for ${response.data[0].data.vehicleType} with plate number ${response.data[0].data.plateNumber} have been completed.`;
                        tracking = {
                            ...response.data[0].tracking,
                            completed: true,
                        }
                    } else if (status == "ready") {
                        message = `Your wash schedule for ${response.data[0].data.vehicleType} with plate number ${response.data[0].data.plateNumber} ready.`;
                        tracking = {
                            ...response.data[0].tracking,
                            ready: true
                        }
                    }

                    let payload = {
                        tracking,
                        status,
                        id,
                        message
                    }
                    UpdateScheduleModel(payload)
                        .then(responseX => {
                            if (responseX.error != null) {
                                res.send({
                                    success: false,
                                    message: "An error occured",
                                    data: [],
                                    responseX
                                })
                            } else {
                                AddNotifictionsController({
                                    user: response.data[0].user, // who created the schedule
                                    data: {
                                        type: "SCHEDULE UPDATE",
                                        meta: {
                                            status,
                                            id: response.data[0].id // schedule id
                                        },
                                        message,
                                        date: CurrentDate()
                                    }
                                })
                                    .then(response2 => {
                                        console.log(response2)
                                        if (response2.success == false) {
                                            res.send({
                                                success: false,
                                                message: response2.message,
                                                data: null,
                                            })
                                        } else {
                                            res.send({
                                                success: true,
                                                message: "Schedule status updated",
                                                data: null,
                                            })
                                        }
                                    })
                                    .catch(error => {
                                        console.log(error)
                                        res.send({
                                            success: false,
                                            message: "An error occured",
                                            data: [],
                                        })
                                    })

                            }
                        })
                        .catch

                }
            })
            .catch(error => {
                res.send(error)
            })
    }

}


module.exports = {
    CreateScheduleController,
    GetAllUserSchedules,
    GetSingleUserSchedules,
    UpdateScheduleController
}