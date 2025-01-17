const { supabase } = require("../../config/supabase-auth")
const { CurrentDate } = require("../utilities")

function AddWalletModel(payload) {
    return supabase
        .from("payments")
        .upsert({
            user: payload.user,
            amount: payload.amount,
            data: payload,
            type: payload.type,
            date: CurrentDate()
        })
        .select()
}


function FetchUsersTransactionHistoryService(uuid) {
    console.log(uuid)
    return supabase
        .from("payments")
        .select("*")
        .eq("user", uuid)
        .order('id', { ascending: false })
}

module.exports = {
    AddWalletModel,
    FetchUsersTransactionHistoryService
}