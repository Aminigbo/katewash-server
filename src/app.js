let express = require("express")

// require rxpress path module
const path = require("path");

// importing body parser
const bodyParser = require("body-parser");



// port
let port = 2023;


let app = express()




// this package helps us recieve data from users in json format durring post method
app.use(bodyParser.json()); //application json






// for post requests
app.use(express.json())

app.use("/assets/images", express.static(path.join(__dirname, "images")));

app.use(express.static(path.join(__dirname, "images")));


// this middleware allows CORS (cross origin resource sharing)
// which means api can be shared between different servers running
// on different ports,
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");// this can be predictor.com
    res.setHeader("Access-Control-Allow-Method", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})


// Routes
app.use("/api/v1", require("./routes/"))
app.use("/", (req, res) => {
    res.send("Welcome to Katewash server 00.89.")
})

app.listen(port, () => {
    console.log("Server started on port " + port);
})

