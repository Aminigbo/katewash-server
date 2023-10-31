var { supabase } = require("../../config/supabase-auth")

function SignUpModel(payload) {
    return supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
            data: payload
        }
    })
}

// signup to public folder
function PublicFolderModel(payload) {
    return supabase
        .from("users")
        .insert({
            name: payload.name,
            email: payload.email,
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            FcnToken: payload.FcnToken,
            uuid: payload.uuid,
            wallet:0
        })
}

// user login model
function SignInModel(payload) {
    return supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
    })
}


// update user's accessToken
function updateAccessTokenModel(payload) {
    return supabase
        .from("users")
        .update({
            accessToken: payload.token,
            refreshToken: payload.refreshToken,
            FcnToken: payload.FcnToken
        })
        .eq('email', payload.email)
        .select()
}


// update User's wallet balance
function UpdateWalletModel(payload) {
    return supabase
        .from("users")
        .update({
            wallet: payload.amount,
        })
        .eq('email', payload.email)
        .select()
}


//  fetch user's pulic data
function FetchMetaData(uuid) {
    return supabase
        .from("users")
        .select("*")
        .eq("uuid", uuid)
}

// update user's password
function UpdatePssword(payload) {
    return supabase.auth.admin.updateUserById(
        payload.uuid,
        {
            password: payload.password,
            user_metadata: { password: payload.password }
        }
    )
}

 
// update user's password
function UpdateWallet(payload) {
    return supabase.auth.admin.updateUserById(
        payload.uuid,
        {
            user_metadata: { wallet: payload.wallet }
        }
    )
}


//  fetch user's pulic data by email
function FetchMetaDataByEmail(email) {
    return supabase
        .from("users")
        .select("*")
        .eq("email", email)
}


//  fetch user's pulic data by email
function FetchAllUsers() {
    return supabase
        .from("users")
        .select("*")
    // .eq("email", email)
}


module.exports = {
    // /====================
    SignUpModel, // sign up user
    PublicFolderModel, // create user in public folder
    SignInModel, // sign in user
    updateAccessTokenModel, // update accessToken, refreshToken anf FcnToken
    FetchMetaData, // fetch users public data
    UpdatePssword, //update password
    UpdateWalletModel, // update user's wallet
    FetchMetaDataByEmail, // fetch user by email


    // ====
    FetchAllUsers,
    UpdateWallet
}