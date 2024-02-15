const { supabase } = require("../../config/supabase-auth")
const { FetchMetaData, PublicFolderModel, SignUpModel, SignInModel, updateAccessTokenModel, UpdatePssword, FetchMetaDataByEmail, FetchAllUsers } = require("./auth-models")



//  User signup controller
function SignUpController(req, res, next) {
    let uuid = req.body

    // res.send(req.body)
    let { name, email, country, city, password, FcnToken, phone } = req.body;

    if (!name || !email || !country || !city || !password || !FcnToken || !phone) {
        res.send({
            success: false,
            message: "Provide all data",
            data: [],
        })
    } else {
        FetchMetaData(uuid).then(response => {
            // res.send(response)

            if (response.data.length > 0) {
                res.send({
                    success: false,
                    message: "User already exists",
                    data: null
                })
            } else {
                let payload = {
                    name,
                    city,
                    email,
                    password, // salt this password later
                    country,
                    phone
                }
                SignUpModel(payload)
                    .then(response => {
                        let User = response.data;
                        if (response.error != null) {
                            res.send({
                                success: false,
                                message: response.error.message,
                                data: null,
                            })
                        } else {
                            let payload2 = {
                                name,
                                email,
                                phone,
                                accessToken: User.session.access_token,
                                refreshToken: User.session.refresh_token,
                                FcnToken,
                                uuid: User.user.id
                            }
                            PublicFolderModel(payload2)
                                .then(response2 => {
                                    if (response2.error == null) {
                                        res.send({
                                            success: true,
                                            message: "Successful",
                                            data: {
                                                name,
                                                phone,
                                                city,
                                                email,
                                                country,
                                                accessToken: User.session.access_token,
                                                refreshToken: User.session.refresh_token,
                                                uuid: User.user.id,
                                                OTP: 11220
                                            },
                                        })
                                    } else {
                                        res.send({
                                            success: false,
                                            message: "An error occured",
                                            data: response2,
                                        })
                                    }
                                })
                        }

                    })
            }
        })
    }

}

// Login controller
function LoginController(req, res) {
    let { email, password, FcnToken } = payload = req.body

    if (!email || !password || !FcnToken) {
        res.send({
            success: false,
            message: "Provide all login payload",
            data: [],
        })
    } else {
        SignInModel(payload)
            .then(response => {
                if (response.error != null) {
                    res.send({
                        success: false,
                        message: response.error.message,
                        data: response,
                    })
                } else {
                    let payload2 = {
                        token: response.data.session.access_token,
                        refreshToken: response.data.session.refresh_token,
                        email: response.data.user.email,
                        FcnToken
                    }
                    updateAccessTokenModel(payload2)
                        .then(response2 => {
                            if (response2.error != null) {
                                res.send({
                                    success: false,
                                    message: "An error occuredXXX",
                                    data: response2,
                                })
                            } else {
                                res.send({
                                    success: true,
                                    message: "Logged in successfuly",
                                    data: {
                                        ...response.data.user.user_metadata,
                                        accessToken: response.data.session.access_token,
                                        refreshToken: response.data.session.refresh_token,
                                        uuid: response.data.user.id,
                                        
                                    },
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            res.send({
                                success: false,
                                message: "An error occuredXX",
                                data: error,
                            })
                        })
                }
            })
            .catch(error => {
                res.send({
                    success: false,
                    message: "An error occuredX",
                    data: error,
                })
            })
    }

}

// request otp controller
function RequestOtpController(req, res) {
    let { email } = req.body
    if (!email) {
        res.send({
            success: false,
            message: "Provide all payload",
            data: [],
        })
    } else {

        FetchMetaDataByEmail(email)
            .then(response => {
                if (response.error != null) {
                    res.send({
                        success: false,
                        message: "An error occured",
                        data: response,
                    })
                } else {
                    if (response.data.length < 1) {
                        res.send({
                            success: false,
                            message: "User do not exist",
                            data: [],
                        })
                    } else {
                        res.send({
                            success: true,
                            message: "OTP sent",
                            data: {
                                uuid: response.data[0].uuid,
                                OTP: 11220
                            },
                        })
                    }

                }
            })
    }

}

function ResetPasswordController(req, res) {
    let { password, uuid } = payload = req.body
    if (!password || !uuid) {
        res.send({
            success: false,
            message: "Provide all payload",
            data: [],
        })
    } else {
        UpdatePssword(payload)
            .then(response => {
                if (response.error != null) {
                    res.send({
                        success: false,
                        message: "Invalid user ID",
                        data: [],
                    })
                } else {
                    res.send({
                        success: true,
                        message: "Password reset was successful",
                        data: [],
                    })
                }
            })
            .catch(error => {

            })
    }

}



module.exports = {
    SignUpController,
    LoginController,
    RequestOtpController,
    ResetPasswordController,
}