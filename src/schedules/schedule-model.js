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
        .order('id', { ascending: false })
}


function GetSingleUserSchedulesModel(payload) {
    console.log(payload)
    return supabase
        .from("schedules")
        .select("*")
        .eq("user", payload.uuid)
        .eq("id", payload.id)
        .order('id', { ascending: false })
}


function GetSingleSchedulesModelyId(id) {
    return supabase
        .from("schedules")
        .select("*")
        .eq("id", id)
}


function UpdateScheduleModel(payload) {
    return supabase
        .from("schedules")
        .update({
            status: payload.status,
            tracking: payload.tracking,
        })
        .eq('id', payload.id)
        .select()
}

module.exports = {
    CreateSceduleModel,
    GetAllUserSchedulesModel,
    GetSingleUserSchedulesModel,
    UpdateScheduleModel,
    GetSingleSchedulesModelyId
}