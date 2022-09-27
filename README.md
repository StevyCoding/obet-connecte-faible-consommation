# obet-connecte-faible-consommation
Pour la partie LM35
Il faut tout d'abord cabler le capteur et le buzzer comme dans le schéma suivant

![image](https://user-images.githubusercontent.com/75209363/192166924-470ccdf0-5e2e-42c0-9acb-7ad4d71e83cc.png)

Il faut cabler la pin 36 du ESP32 sur la pin analogique du lm35 et la pin positive du buzzer sur l pin 2 de l'ESP32

et télverser le code 

Il faut aussi configurer la connexion wifi avec celle du serveur associé.

En respectant cela le code devrait fonctionner.

## Serveur Nodejs

dependances :

```
npm i express

```

```
npm i express

```
```
npm i cors
```

# Serveur Nodejs

Les dependances sont les différent modules que l'ont pourra utilisé opour faire tourner notre serveur Nodejs .

### Express.js

Express js est une framework backend pour creer des restful API avec nodejs.  Grace à ce framework on pourra crée des requêtes HTTP plus facilement.

exemple d'utilisation   :

On import le module dans le code 

```js
var express = require('express');
```

Une fois importer on peut  utiliser le module pour creer notre premier serveur http  qui écoute sur le port 8080:

````js
var app =  express();
app.get('/', (req, res) => {
    res.send(JSON.stringify(graphData()))
  })
app.listen(8080, function () {
    console.log('Example app listening on port 8080.');
});
````

### Body-parser

Comme on veut que le serveur reçoive des  requête sous la forme de json il est important d'utiliser un middleware qui lui permettra de supporter ce type de requête. body-parser extrait la totalité du corps d'une requête entrante et l'expose dans req.body.

Le middleware faisait auparavant partie d'Express.js, mais il doit  désormais  être installer séparément.

Ce module body-parser analyse les données codées JSON, buffer, string et URL soumises à l'aide d'une requête HTTP POST. il faut installer body-parser en utilisant NPM comme indiqué ci-dessous.

une fois installer il faut l'importer et définir les paramètres dans app.use().

````js
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

````

### CORS

CORS est l'abréviation de Cross-Origin Resource Sharing. Il nous permet d'assouplir la sécurité appliquée à une API. Cela se fait en contournant les en-têtes Access-Control-Allow-Origin, qui spécifient quelles origines peuvent accéder à l'API.

En d'autres termes, CORS est une fonction de sécurité du navigateur qui restreint les requêtes HTTP inter-origine avec d'autres serveurs et spécifie quels domaines ont accès à vos ressources.

Pour l'utiliser il suffit de   :

```js 
const cors = require('cors');
app.use(cors());

```

Une fois le serveur configuré il suffit de l'initialiser avec la commande 

``` 
node filename.js 
```

# Client Angular 

Angular est un framework d'application Web gratuit et open source basé sur TypeScript, dirigé par l'équipe Angular de Google et par une communauté d'individus et d'entreprises. Angular est une réécriture complète de la même équipe qui a construit AngularJS.

pour démarer Angular il suffi d'utiliser la commande :

```
ng serve -o
```


Dans le dossier srx ->  app -> line-chart -> line-chart.component.ts  il ya le code typescript pour afficher le graphe d'humité de tmepérature  en fonction des heures de la journéee.

il faut importer la lbibliothèque qui permet de faire des requêtes http 

```ts
import { HttpClient } from '@angular/common/http';
```

Pour faire un GET request  

```ts
this._httpClient.get<any>('http://127.0.0.1:8080').subscribe({
      next: data => {
        bm680 = data.bm680; // donnée récuperer
        this.createChart();
        this.createChartGaz();
        this.createChartHumidite();
      },
      error: error => {

      }
    })

```



Exemple de construction d'un graphe


```ts
    var ctx = this.canvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: label,
        datasets: [
          {
            label: "temperature",
            data: temperature,
            backgroundColor: 'rgb(250,128,114)',
            borderColor: 'rgb(250,128,114)',
          },

        ]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        }
      }

    });
```

Calcul de la moyenne  pour lla jauge
```ts
    const sum = temperature.reduce((a, b) => a + b, 0);
    this.avgTemp = (sum / temperature.length) || 0;
    var avg  =  this.avgTemp;
```

Exemple de construction  d'une jauge   :

```ts
   Gauge(document.getElementById("gauge-demo"),{
      dialRadius: 40,
      dialStartAngle: 135,
      dialEndAngle: 45,
      value: avg,
      max: 100,
      min: 0,
      valueDialClass: "value",
      valueClass: "value-text",
      dialClass: "dial",
      gaugeClass: "gauge",
      showValue: true,
      gaugeColor: null,
      label: function(value: number) {return Math.round(avg) + "\n C°" ;} // returns a string label that will be rendered in the center
  });
```
On démarre angula avec le code  



