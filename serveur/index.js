'use strict';
var http = require('http');
const fs = require('fs');

var express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.use(cors());
//  creation de l'objet graph poiur stocker les information envoyé par l'alarme à incendie
class Graph {
    constructor() {
        let date = new Date();
        this.date = formatNumber(date.getDay()) + "/" + formatNumber(date.getMonth()) + "/" + date.getFullYear()
        this.coordinateTemperature = [];
        this.type;
    }
    initDate() {

        let date = new Date();
        this.date = formatNumber(date.getDay()) + "/" + formatNumber(date.getMonth()) + "/" + date.getFullYear()

    }

}


class GraphLm35 extends Graph {
    insertTemperatureData(data) {
        this.coordinateTemperature.push(data);
    }
}

class GraphBm680 extends GraphLm35 {
    constructor() {
        super();
        this.coordinateHumidity = [];
    }
    insertHumidityData(data) {
        this.coordinateHumidity.push(data);
    }
}

let graphBm680 = new GraphBm680();
let graphlm35 = new GraphLm35();


function formatNumber(number) {
    if (number < 10)
        return number = "0" + number;
    else
        return number
}

// creation d'un listen pour mettre le serveur en écoute lorsque le esp32 décide d'envoyer des données


// express
app.post('', function (req, res) {
    var date = new Date();
    var sensor = req.body.sensor


     sensor.date = formatNumber(date.getDay()) + "/" + formatNumber(date.getMonth()) + "/" + date.getFullYear();
    sensor.heure  = formatNumber(date.getHours())+":"+formatNumber(date.getMinutes());

    console.log(sensor);
    var getGraph =  graphData();
    if(!getGraph.hasOwnProperty('lm35')){
        getGraph.lm35 = [];
    }
    if(!getGraph.hasOwnProperty('bm680')){
        getGraph.bm680 = [];
    }
    if (sensor.type == "lm35") {

        if (Object.entries(getGraph.lm35).length > 0) {
            let graph =  getGraph.lm35.filter(lm=> lm.date == sensor.date)[0];
            if (graph != null) {
               
            } else {
                graphBm680.initDate();
                graphBm680.insertTemperatureData(sensor.temperature)

                var graphJson = {"temperature": sensor.temperature, "heure" : sensor.heure};
                getGraph.lm35.push(graphJson);
                writeTojsonGraph(getGraph);
            }

        }else{
            graphBm680.initDate();
            graphBm680.insertTemperatureData(sensor.temperature)

            getGraph.lm35 = [{"temperature": sensor.temperature, "heure" : sensor.heure}]
            getGraph.date = sensor.date;

            writeTojsonGraph(getGraph);         
        }

    }
    else if (sensor.type == "bm680") {
  
        
        if (Object.entries(getGraph.bm680).length > 0) {

            let graph =  getGraph.bm680.filter(bm=> bm.date == sensor.date)[0];
            console.log(graph)
            if (graph != null) {
               
            } else {
                graphBm680.initDate();
                graphBm680.insertTemperatureData(sensor.temperature)

                var graphJson = {"temperature": sensor.temperature,"humidite": sensor.humidite,"pression" :  sensor.pression, "heure" : sensor.heure};
                getGraph.bm680.push(graphJson);
                writeTojsonGraph(getGraph);
            }
        }else{
            graphBm680.initDate();
            graphBm680.insertTemperatureData(sensor.temperature)

            getGraph.bm680 = [{"temperature": sensor.temperature,"humidite": sensor.humidite,"pression" :  sensor.pression, "heure" : sensor.heure}]
            getGraph.date = sensor.date;

            writeTojsonGraph(getGraph); 
        }
    } 
});

app.get('/', (req, res) => {
    res.send(JSON.stringify(graphData()))
  })
app.listen(8080, function () {
    console.log('Example app listening on port 8080.');
});


/*  http.createServer(function (req, res) {

    if (req.method == 'POST') {
        //console.log("got the post request")
        let body;
        req.on('data', function (data) {



        })


    }
    else if( req.method == 'GET' ){
        res.write(JSON.stringify(graphData()))
        console.log(JSON.stringify(graphData()))
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end();

}).listen(8080); */ 

function graphData() {
    let rawdata = fs.readFileSync('./fireGraph.json');
    let result = JSON.parse(rawdata);
    return result;
}

function writeTojsonGraph(jsonContent) {
    var data =  JSON.stringify(jsonContent)
    fs.writeFile("fireGraph.json", data, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
     
        console.log("JSON file has been saved.");
    });
}