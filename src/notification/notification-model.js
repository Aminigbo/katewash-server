var { supabase } = require("../../config/supabase-auth")

function GetAllNotifictionsModel(user) {
    return supabase
        .from("notification")
        .select("*")
        .eq("user", user)
}

function SaveNotificationModel(payload) {
    return supabase
        .from("notification")
        .upsert({
            user: payload.user,
            data: payload.data,
        })
        .select()
}

module.exports = {
    SaveNotificationModel,
    GetAllNotifictionsModel
}