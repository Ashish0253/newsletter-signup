const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res)=> {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/979422c508";
    const options = {
        method: "POST",
        auth: "ashish:ab6fb3ca432c7d54e10f80243212fcb6-us21"
    }

    const request = https.request(url, options, (response)=> {
        
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        
        response.on("data", (data)=> {
            // console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})


app.post("/failure", (req, res)=> {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, ()=> {
    console.log("Server is running on port 3000");
})

// api key = ab6fb3ca432c7d54e10f80243212fcb6-us21

// list id = 979422c508