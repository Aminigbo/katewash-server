const { GetAllNotifictionsModel, SaveNotificationModel } = require("./notification-model");

function GetAllNotifictionsController(req, res) {
    let { user } = req.params;
    if (!user) {
        res.send({
            success: false,
            message: "Invalid payload",
            data: [],
        })
    } else {
        GetAllNotifictionsModel(user)
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
                        message: "Successful",
                        data: response.data,
                    })
                }
            })
            .catch(error => {
                res.send({
                    success: false,
                    message: "Invalid payload",
                    data: [],
                })
            })
    }
}


function AddNotifictionsController(payload) {
    let { user, data} = payload;
    if (!user || !data) {
        return ({
            success: false,
            message: "Invalid payload",
            data: [],
        })
    } else {
        return SaveNotificationModel(payload)
            .then(response => {
                if (response.error != null) {
                    return ({
                        success: false,
                        message: "An error occured",
                        data: [],
                    })
                } else {
                    return ({
                        success: true,
                        message: "Successful",
                        data: null,
                    })
                }
            })
            .catch(error => {
                return ({
                    success: false,
                    message: "Invalid payload",
                    data: [],
                })
            })
    }
}


module.exports = {
    GetAllNotifictionsController,
    AddNotifictionsController
}