var { supabase } = require("../../config/supabase-auth")

function CreateSceduleModel(payload) {
    return supabase
        .from("schedules")
        .upsert({
            user: payload.uuid,
            data: payload,
        })
        .select()
}

function GetAllUserSchedulesModel(uuid) {
    return supabase
        .from("schedules")
        .select("*")
        .eq("user", uuid)
}


function GetSingleUserSchedulesModel(payload) {
    console.log(payload)
    return supabase
        .from("schedules")
        .select("*")
        .eq("user", payload.uuid)
        .eq("id", payload.id)
}

module.exports = {
    CreateSceduleModel,
    GetAllUserSchedulesModel,
    GetSingleUserSchedulesModel
}