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

module.exports = {
    CreateSceduleModel
}