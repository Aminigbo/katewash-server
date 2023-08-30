const { CreateSceduleModel } = require("./schedule-model");

function CreateScheduleController(req, res) {
    let { vehicleType, vehicleColor, plateNumber, subscription, uuid, starting } = payload = req.body;

    if (!vehicleType || !vehicleColor || !plateNumber || !subscription || !uuid, starting) {
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

module.exports = {
    CreateScheduleController
}