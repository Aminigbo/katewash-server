const { supabase } = require("../../config/supabase-auth")

// get all events
function AllActiveEventsModel() {
    return supabase
        .from("donations")
        .select("*")
        .eq("isActive", true)
        .order('id', { ascending: false })

}

// get single event by ID
function SingleEventByID(id) {
    return supabase
        .from("donations")
        .select("*")
        .eq("isActive", true)
        .eq("id", id)

}


function AddDonation(payload) {
    return supabase
        .from("donations")
        .update({ donations: payload.donations })
        .eq('id', payload.id)
}


function AddCampaign(payload) {
    return supabase
        .from("donations")
        .insert({
            deadline: payload.deadline,
            poster: payload.poster,
            meta: payload,
            poster_id: payload.poster_id,
            isActive: true
        })
        .select()
}


// invite user to support campaign
function InviteModel(payload) {
    return supabase
        .from("notifications")
        .insert({
            user: payload.user.phone,
            invitee: payload.invitee.phone,
            meta: payload,
            type: payload.type,

        })
}

module.exports = {
    AllActiveEventsModel,
    SingleEventByID,
    AddDonation,
    AddCampaign,
    InviteModel
}