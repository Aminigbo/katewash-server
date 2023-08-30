var fcm = require('../../fcm/fcm-lib');
var serviceAccount = require("../../config/push-notification-key.json")
var FCM = new fcm(serviceAccount);

function sendToSingleToken({
    largeImg,
    id,
    title,
    message,
    token
}) {
    try {
        var message = {
            data: {
                largeImg,
                id,
            },
            notification: {
                title,
                body:message
            },
            android: {
                priority: 'high',
                notification: { icon: "@mipmap/ic_launcher", }
            },
            token
        };
        FCM.send(message, function (err, response) {
            if (err) {
                console.log(err)
                return {
                    error: err
                }
            } else {
                console.log(response)
                return {
                    message: response
                }
            }

        })
    }
    catch (error) {
        console.log(error)
        return {
            error: error
        }
    }
}


function sendToMultipleToken({
    tokens,
    id,
    largeImg,
    title,
    message
}) {
    console.log("first")
    try {
        var message = {
            data: {
                largeImg,
                id,
            },
            notification: {
                title,
                body: message,
                image: "https://ddhqtepvmjgbfndcjrkn.supabase.co/storage/v1/object/public/images/0.5203534930645486.jpg"
            },
            android: {
                priority: 'HIGH',
                notification: {
                    icon: "@mipmap/ic_launcher",
                    visibility: "PUBLIC"
                }
            },

        };
        FCM.sendToMultipleToken(message, tokens, function (err, response) {
            console.log("second")
            if (err) {
                console.log(err)
                return {
                    error: err
                }
            } else {
                console.log(response)
                return {
                    message: response
                }
            }

        })
    }
    catch (error) {
        console.log(error)
        return {
            error: error
        }
    }
}
module.exports = {
    sendToSingleToken,
    sendToMultipleToken
}