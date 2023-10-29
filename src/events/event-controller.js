const { MultipleNotification } = require("../utilities/multiple-noti");
const { SingleNotification } = require("../utilities/single-noti");
const { AllActiveEventsModel, SingleEventByID, AddDonation, AddCampaign, InviteModel } = require("./event-model")


function CreateEvent(req, res) {
    let { title, amount, deadline, poster, poster_id, description, posterPhone, Img } = payload = req.body;
    if (!title || !amount || !deadline || !poster || !poster_id || !description || !posterPhone) {
        res.send({
            success: false,
            message: "Invalid payload",
            data: null
        })
    } else {
        AddCampaign(payload)
            .then(response => {
                if (response.error == null) {

                    // send bulk push notification
                    MultipleNotification({
                        UserPhone: posterPhone,
                        id: `EVENT:${response.data[0].id}`,
                        tag: "BCS Events",
                        largeImg: `https://ddhqtepvmjgbfndcjrkn.supabase.co/storage/v1/object/public/images/${Img.uri}`,
                        title: `${title}`,
                        message: `${description}`
                    })

                    res.send({
                        success: true,
                        message: "Event created",
                        data: []
                    })
                } else {
                    console.log(response)
                    res.send({
                        success: false,
                        message: "An error occured",
                        data: null
                    })
                }
            })
            .catch(error => {
                console.log(error)
                res.send({
                    success: false,
                    message: "An error occured",
                    data: null
                })
            })
    }
}

function GetAllEvents(req, res) {
    AllActiveEventsModel()
        .then(response => {
            if (response.error == null) {
                let ActiveEvents = response.data.filter(e => new Date(e.deadline) > new Date())
                res.send({
                    success: true,
                    message: "Events fetched",
                    count: ActiveEvents.length,
                    data: ActiveEvents
                })
            } else {
                res.send({
                    success: false,
                    message: "An error occured",
                    data: null
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.send({
                success: false,
                message: "An error occured",
                data: null
            })
        })
}

function GetSingleEvent(req, res) {
    let { id } = req.params
    SingleEventByID(id)
        .then(response => {
            if (response.error != null) {
                res.send({
                    success: false,
                    message: "An error occured",
                    data: null
                })
            } else {
                if (response.data.length < 1) {
                    res.send({
                        success: false,
                        message: "No event found",
                        data: []
                    })
                } else {
                    res.send({
                        success: true,
                        message: "Event fetched",
                        data: response.data[0]
                    })
                }
            }
        })
        .catch(error => {
            res.send({
                success: false,
                message: "An error occured",
                data: null
            })
        })
}

function MakeDonation(req, res) {
    let { event, user, amount } = req.body

    // get the particular event
    SingleEventByID(event)
        .then(response => {
            if (response.error != null) {
                console.log(response)
                res.send({
                    success: false,
                    message: "An error occured",
                    data: null
                })
            } else {
                let Event = response.data[0]
                let EventDonations = Event.donations // the all the event donations
                EventDonations.push(req.body)  // add the new donation object

                let payload = {
                    donations: EventDonations,
                    id: event
                }
                AddDonation(payload)
                    .then(response => {
                        if (response.error != null) {
                            console.log(error)
                            res.send({
                                success: false,
                                message: "An error occured",
                                data: null
                            })
                        } else {

                            // send a push notification the the recruiter 
                            SingleNotification({
                                UserID: Event.meta.posterPhone,
                                id: `EVENT:${event}`,
                                tag: "Event Donation",
                                largeImg: `https://ddhqtepvmjgbfndcjrkn.supabase.co/storage/v1/object/public/images/${Event.meta.Img.uri}`,
                                title: `₦${amount} donation`,
                                message: `${user.name} donated ₦${amount} to ${Event.meta.title} See more details`
                            })


                            res.send({
                                success: true,
                                message: "Donation added successfully",
                                data: []
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        res.send({
                            success: false,
                            message: "An error occured",
                            data: null
                        })
                    })

            }
        })
        .catch(error => {
            console.log(error)
            res.send({
                success: false,
                message: "An error occured",
                data: null
            })
        })
}


// invite someone to support campaign
function InviteToSupport(req, res) {
    let { user, invitee, event, type } = payload = req.body;


    InviteModel(payload)
        .then(response => {
            if (response.error != null) {
                res.send({
                    success: false,
                    message: "An error occured",
                    data: null
                })
            } else {
                SingleNotification({
                    UserID: invitee.phone,
                    id: `EVENT:${event.id}`,
                    tag: "Event Donation",
                    largeImg: `https://ddhqtepvmjgbfndcjrkn.supabase.co/storage/v1/object/public/images/${event.img}`,
                    title: `Support ${event.title}`,
                    message: `${user.name} has invited you to support the ${event.title} via the Upendo App, see campaign`,
                })
                res.send({
                    success: true,
                    message: "Successful",
                    data: null
                })
            }
        })
        .catch(error => {
            res.send({
                success: false,
                message: "An error occured",
                data: null
            })
        })


}

module.exports = {
    GetAllEvents,
    GetSingleEvent,
    MakeDonation,
    CreateEvent,
    InviteToSupport
}