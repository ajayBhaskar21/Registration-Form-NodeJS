
const express = require('express');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');


const app = express();
const port = 1111 || process.env.PORT;
dotEnv.config();

const username = process.env.USER;
const password = process.env.PASS;

// mongo db connection url
let url = `mongodb+srv://${username}:${password}@cluster0.ctsfbwo.mongodb.net/RegistrationFormDB`;


// middle ware
app.use(bodyParser.urlencoded({ extended : true })); // to use req.body 
app.use(bodyParser.json());

// connect to the mongoDB database
mongoose.connect(url, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
});


// Define Schema (similar to creating a table in sql)
let dbSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});


// define model for that schema
let userModel = mongoose.model("user", dbSchema);

// Handle Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

app.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;

        let existingUser = await userModel.findOne({ email : email });
        if (!existingUser){
            // create object for the model
            let dataObj = new userModel({
                name,
                email,
                password
            });
            await dataObj.save();
            res.redirect('/success');
        }
        else {
            console.log('user already exists');
            res.redirect('/error');
        }

        
    }
    catch (error) {
        console.log(error);
        res.redirect('/error');
    }
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/pages/success.html');
})

app.get('/error', (req, res) => {
    res.sendFile(__dirname + '/pages/error.html');
});


app.listen(port, () => {
    console.log(`server running at port ${port}`);
});
