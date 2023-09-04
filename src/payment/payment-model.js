const { supabase } = require("../../config/supabase-auth")

function AddWalletModel(payload) {
    return supabase
        .from("payments")
        .upsert({
            user: payload.user,
            amount: payload.amount,
            data: payload,
        })
        .select()
}

module.exports = {
    AddWalletModel
}