const { CreateSceduleModel, GetAllUserSchedulesModel, GetSingleUserSchedulesModel } = require("./schedule-model");

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
            message: "Invalid payloa",
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



module.exports = {
    CreateScheduleController,
    GetAllUserSchedules,
    GetSingleUserSchedules,
}