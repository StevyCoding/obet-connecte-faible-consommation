# obet-connecte-faible-consommation
Pour la partie LM35
Il faut tout d'abord cabler le capteur et le buzzer comme dans le schéma suivant

![image](https://user-images.githubusercontent.com/75209363/192166924-470ccdf0-5e2e-42c0-9acb-7ad4d71e83cc.png)

Il faut cabler la pin 36 du ESP32 sur la pin analogique du lm35 et la pin positive du buzzer sur l pin 2 de l'ESP32

et télverser le code 

Il faut aussi configurer la connexion wifi avec celle du serveur associé.

En respectant cela le code devrait fonctionner.

## Serveur Nodejs

dependance :

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

Le middlewarel faisait auparavant partie d'Express.js, mais il doit  désormais  être installer séparément.

Ce module body-parser analyse les données codées JSON, buffer, string et URL soumises à l'aide d'une requête HTTP POST. il faut installer body-parser en utilisant NPM comme indiqué ci-dessous.

une fois installer il faut l'importer et définir les paramètre dans app.use().

````js
const bodyParser = require('body-parser');

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
````

### CORS

CORS est l'abréviation de Cross-Origin Resource Sharing. Il nous permet d'assouplir la sécurité appliquée à une API. Cela se fait en contournant les en-têtes Access-Control-Allow-Origin, qui spécifient quelles origines peuvent accéder à l'API.

En d'autres termes, CORS est une fonction de sécurité du navigateur qui restreint les requêtes HTTP inter-origine avec d'autres serveurs et spécifie quels domaines ont accès à vos ressources.

Pour l'utiliser il suffit de   :

```js 
const cors = require('cors');
app.use(cors());

```

Une foit le serveur configurer il suffit de l'initialiser avec un 

``` 
node filename.js 
```


