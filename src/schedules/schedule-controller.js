const { AddNotifictionsController } = require("../notification/notification-controllers");
const { CreateSceduleModel, GetAllUserSchedulesModel, GetSingleUserSchedulesModel, UpdateScheduleModel, GetSingleSchedulesModelyId } = require("./schedule-model");

function CreateScheduleController(req, res) {
    let { vehicleType, vehicleColor, plateNumber, subscription, uuid, starting } = payload = req.body;

    if (!vehicleType || !vehicleColor || !plateNumber || !subscription || !uuid, !starting) {
        res.send({
            success: false,
            message: "Provide all payload",
            data: [],
        })
    } else {
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
                    let tracking = {}
                    if (status == "confirmed") {
                        tracking = {
                            ...response.data[0].tracking,
                            confirmed: true,
                        }
                    } else if (status == "processed") {
                        tracking = {
                            ...response.data[0].tracking,
                            processed: true
                        }
                    } else if (status == "completed") {
                        tracking = {
                            ...response.data[0].tracking,
                            completed: true,
                        }
                    } else if (status == "ready") {
                        tracking = {
                            ...response.data[0].tracking,
                            ready: true
                        }
                    }

                    let payloa = {
                        tracking,
                        status,
                        id
                    }
                    UpdateScheduleModel(payloa)
                        .then(responseX => {
                            if (responseX.error != null) {
                                console.log(responseX.error)
                                res.send({
                                    success: false,
                                    message: "An error occured",
                                    data: [],
                                })
                            } else {
                                AddNotifictionsController({
                                    user: response.data[0].user, // who created the schedule
                                    data: {
                                        type: "SCHEDULE UPDATE",
                                        meta: {
                                            status,
                                            id: response.data[0].id // schedule id
                                        }
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