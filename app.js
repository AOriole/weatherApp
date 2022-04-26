const json = require('body-parser/lib/types/json');     // gets imported by default
const express = require('express');
const https = require('https');                         // import https module from node to get data from external server
const bodyParser = require('body-parser');             // import for user input received via the html <form>
const urlencoded = require('body-parser/lib/types/urlencoded');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));


//Route 1 : home
app.get('/', function(req,res){
    res.sendFile(__dirname + "/index.html");        // post request by index.html
});

// catch request
app.post("/", function(req,res){
    // console.log("post request recived <--- Chk hype terminal");
    
    // get openWeather url from postman & assign to a var
    // const url = "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&units=metric&appid=b3726f7e4ac9c3d1a9cb0b50139af665";   // search by geo coordinates for Japans (Shuzenji) city
    // this is done by Get request, that gets data for a specific/one city or location

    const query = req.body.cityName;
    const unit = 'metric';   
    const apiKey = 'b3726f7e4ac9c3d1a9cb0b50139af665';
                                                         

    // by post request to get the data of any city ---- makes it dynamic
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" +query+ "&units=" +unit+ "&appid=" +apiKey;            // search by city name

    https.get(url, function(response){
        // console.log(response);
        console.log(response.statusCode);   // print status code of response on console, 200 means success

        // chk (data buffer) response recived from external server , using on() method & a callback function which gets hold of from response
        response.on("data", function(data){
            //console.log(data);

            //convert data into a js obj by parsing json data 
            const weatherData = JSON.parse(data);
            //print entire js obj
            //console.log(weatherData);

            // use weather date to pull out specific pieces of info from it (i.e. from nested obj by digging via our js obj)
            const temp = weatherData.main.temp;         // get temperature
            console.log(temp);

            // using chrome extension to copy-paste the path of info data piece to be printed 
            const feel = weatherData.main.feels_like;       // get feel_like data
            console.log(feel);

            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;       // get the name of weather condition icon from chrome extension
            const imageurl = " http://openweathermap.org/img/wn/" +icon+ "@2x.png";     // get icon url 

            console.log(humidity);
            console.log(windSpeed);
            console.log(desc);

            // send the data from my server to the client's browser that was parsed from external server
            res.write('<h1>The temp in ' +query+ ' is ' +temp+ ' degree Celcius</h1>');
            res.write('<p>The current weather is '+desc+ '</p>');
            res.write('<p>It feels like '+feel+ '</p>');
            res.write('<p>The humiduty is '+humidity+ '</p>');
            res.write('<p>The wind speed is '+windSpeed+ '</p>');
            res.write("<img src=" +imageurl+ ">");
            res.send();

        });

    });
    //we can only have one res.send() method in a given app method, otherwise code crashes
    //res.send("server is up and runnng");

    
});




app.listen('3000', function(){
    console.log('Server started on port 3000');
});