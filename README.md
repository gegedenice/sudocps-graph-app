# Sudoc-PS App
**Application web de visualisation des unicas et des titres de presse locale ancienne pour les Centres Régionaux Sudoc-PS par une modélisation en graphe avec Neo4j**

## Contexte

Le contexte et les objectifs du développement de cette application sont décrits dans [plusieurs billets](http://bibliotheque-blogs.unice.fr/sudoc-ps/tag/application-unicapresse-locale-ancienne/) parus sur le blog du Centre Régional SudocPS PACA/Nice.

Cette documentation est destinée aux Centres qui souhaiteraient installer et déployer cette application peuplée avec leurs propres données

## Architecture

L'application est adossée à une base de données orientée graphe Neo4j, dans laquelle les données sont modélisées et stockées sous forme de noeuds dotés de propriétés et connectés entre eux par des relations typées. Le peuplement initial du graphe s'effectue par une succession de requêtes exprimées dans le language Cypher qui interrogent diverses API du Sudoc et de la BnF.

L'application est une application Node.js servie par Express, le backend s'interfaçant avec la base de données par API REST, et les vues du frontend utilisant le moteur de rendu ejs.
La visualisation en graphe est générée avec la librairie 2d-force-graph basée sur d3.js et les divers composants UI (graphiques et tableaux) avec devextreme, le framework CSS utilisé est [Materialize](https://materializecss.com/).


## Installation

### Pré-requis environnement

Nécessite Node.js v.10 ou supérieure

### Neo4j

#### Installation

La documentation pour installer Neo4j sur les différents systèmes d'exploitation se trouve ici : [https://neo4j.com/docs/operations-manual/current/installation/](https://neo4j.com/docs/operations-manual/current/installation/)

#### Créer une base de données

Choisissez vos login/mot de passe pour l'accès sécurisé à la BDD et reportez vos identifiants dans le fichier des variables d'environnement .env à la racine du répertoire de l'app.

#### Installation du plugin Apoc

Les requêtes Cypher de chargement des données dans le graphe utilisent les fonctionnalités du plugin APOC, vous devez donc installer cette extension, soit directement depuis l'UI du Desktop Neo4j ou en téléchargeant le .jar de la librairie et en le déposant dans <NEO4J_ROOT>/plugins/

#### Modification du fichier de configuration

* Trouver l'emplacement de neo4j.conf selon son système d'exploitation : [https://neo4j.com/docs/operations-manual/current/configuration/file-locations/](https://neo4j.com/docs/operations-manual/current/configuration/file-locations/)

* Ajouter ou décommentez ces 2 lignes
```
dbms.security.procedures.unrestricted=apoc.*
dbms.security.procedures.whitelist=apoc.*
```

### Application

* Download ou clone du dépôt
* ```npm install``` pour installer les packages 
* ```npm run start``` ou ```npm run start:dev``` (en mode watch/reload pour le développement)
* l'application écoute sur le port 9000 (par exemple http://localhost:9000 si vous êtes en local sur un PC), vous pouvez modifier la variable du port dans le fichier .env
* En cas d'installation sur un serveur distant, utiliser un gestionnaire de processus (pm2, forever...) pour lancer et manager l'app localement, et configurer votre serveur web (Apache, Nginx...) comme proxy pour pointer sur l'application.

### Vérification

Une fois la BDD Neo4j et l'application web lancées, vous pouvez vérifier que tout se passe bien en ouvrant http(s): //<votre_nom_de_domaine>/api/test dans un navigateur.

## Création du graphe/chargement des données

### Fichier des ppn unicas

Cette partie est la seule phase manuelle de récupération de données, le seul moyen pour obtenir une liste de ppn pour le corpus des unicas pour l'ILN du CR étant de l'exporter manuellement (en format csv) depuis le guicher AbBESstp -> sudoc (espace pro) -> SELF Sudoc.

Déposez ensuite ce fichier dans <NEO4J_ROOT>/import

### Alimentation automatisée de la bdd

La succession des requêtes Cypher à appliquer est ensuite documentée dans un Gist dédié, dont certains paramètres sont à personnalsier selon votre ILN

[https://gist.github.com/gegedenice/c7e53cc4c3d65b8bc1639d4b55a90be6](https://gist.github.com/gegedenice/c7e53cc4c3d65b8bc1639d4b55a90be6)
