const express = require('express');
const hbs = require('hbs');//by default, nodemon will not watch your handlebar files when you make a change, to fix this run command: nodemon server.js -e js,hbs | the -e flag lets us specify all the extensions we want to watch, in this case: js,hbs 
const fs = require('fs');
const port = process.env.PORT || 3000;

var app = express();//The express() function is a top-level function exported by the express module

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');//enables various express related configurations in key value pairs

app.use((req, res, next) => {//next is for telling express when you are done
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err){
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs'); //without next() method being stated, the current page will display instead of requested url because it's reading from top down
// });

app.use(express.static(__dirname + '/public'));//takes middleware function, though express.static(__dirname) is a built in middleware function, this specific function takes the absolute path to the folder you want to serve up, __dirname stores the path to your project directory, in this case its 'node-web-server'

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => { //this will allow to setup a handler for a http get request. Arguments: (url, function to send back to the requestee)
     res.render('home.hbs', { //render will enbale rendering of any templates set up by view engine
        pageTitle: "Home Page",
        welcomeMessage: "Welcome!"
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', { //render will enbale rendering of any templates set up by view engine
        pageTitle: "About Page"
    });
});

app.get('/bad', (req, res) => {
    res.send({
        error: "Something went wrong"
    })
});

app.listen(port, () => {//second argument is a function which runs when the server is running
    console.log(`Server is up on port ${port}`);
});