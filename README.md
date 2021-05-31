# Sudoc-PS App
**Application web de visualisation des unicas et des titres de presse locale ancienne pour les Centres Régionaux Sudoc-PS.
Cette application s'appuie sur une modélisation en graphe afin de récupérer, lier et rendre explorable les 2 corpus de métadonnées à l'échelle d'un Centre Sudoc-PS.**

## Contexte

Le contexte et les objectifs du développement de cette application sont décrits dans [plusieurs billets](http://bibliotheque-blogs.unice.fr/sudoc-ps/tag/application-unicapresse-locale-ancienne/) parus sur le blog du Centre Régional SudocPS PACA/Nice.

L'application mise en ligne avec les données du Centre de Réseau PACA/Nice est accessible [ici](http://sudocps.univ-cotedazur.fr/sudocps-pro-app/).

Cette documentation est destinée aux Centres SudocPS qui souhaiteraient installer et déployer cette application peuplée avec leurs propres données

## Architecture

L'application est adossée à une base de données orientée graphe Neo4j, dans laquelle les données sont modélisées et stockées sous forme de noeuds dotés de propriétés et connectés entre eux par des relations typées. Le peuplement initial du graphe s'effectue par une succession de requêtes exprimées dans le language Cypher qui interrogent diverses API du Sudoc et de la BnF.

L'application est une application Node.js servie par le middleware Express, le backend s'interfaçant avec la base de données par un ensemble d'API REST. Les vues du frontend utilisent le moteur de template [ejs](https://ejs.co/).
La visualisation en graphe est générée avec la librairie [2d-force-graph](https://github.com/vasturiano/force-graph) basée sur d3.js et les divers composants UI (graphiques et tableaux) avec la librairie de composants [Devextreme](https://js.devexpress.com/).
Enfin le framework CSS utilisé est [Materialize](https://materializecss.com/).


## Installation

### Pré-requis environnement

Nécessite Node.js v.10 ou supérieure

### Neo4j

#### Installation

La documentation pour installer Neo4j sur les différents systèmes d'exploitation se trouve ici : [https://neo4j.com/docs/operations-manual/current/installation/](https://neo4j.com/docs/operations-manual/current/installation/)

#### Créer une base de données

Reportez vos identifiants login/mot de passe d'accès sécurisé à la BDD dans le fichier des variables d'environnement .env à la racine du répertoire de l'app.

#### Installation du plugin Apoc

Les requêtes Cypher de chargement des données dans le graphe utilisent les fonctionnalités du plugin APOC, vous devez donc installer cette extension, soit directement depuis l'UI du Desktop Neo4j ou en téléchargeant le [.jar de la librairie](https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases) et en le déposant dans <NEO4J_HOME>/plugins/

#### Modification du fichier de configuration

* Trouver l'emplacement de neo4j.conf selon son système d'exploitation : [https://neo4j.com/docs/operations-manual/current/configuration/file-locations/](https://neo4j.com/docs/operations-manual/current/configuration/file-locations/)

* Ajouter ou décommentez ces 2 lignes
```
dbms.security.procedures.unrestricted=apoc.*
dbms.security.procedures.whitelist=apoc.*
```

#### Alternative (temporaire, en mode test)

Pour tester l'application sans installer Neo4j, vous pouvez utiliser gratuitement une Sandbox Neo4j en ligne : [https://neo4j.com/sandbox/](https://neo4j.com/sandbox/).

Pour cela :
* Créez-vous un compte utilisateur
* Créez un projet en choisissant l'option Blanck Sandbox, puis ouvrez Neo4j Browser
* Reporter les id d'accès à la sandbox qui s'affichent dans le fichier .env
* L'extension Apoc étant nativement fournie avec l'instance Neo4j mise à disposition, les requêtes sont directement exécutables, par contre le fichier csv contenant les ppn des notices d'unicas doit être accessible en ligne en https pour pouvoir être lu depuis le graphe (depuis un dépôt Github public par exemple).

Attention, l'accès à la sandbox est possible sur une durée limitée : 3 jours prolongeables une fois 7 jours. Passé ce délai, l'instance et les données qu'elle contient sont supprimées.


### Application

* Download ou clone du dépôt
* ```npm install``` pour installer les packages 
* ```npm run start``` ou ```npm run start:dev``` (en mode watch/reload pour le développement)
* l'application écoute sur le port 9000 (par exemple http://localhost:9000 si vous êtes en local sur un PC), vous pouvez modifier la variable d'environnement du port dans le fichier .env
* En cas d'installation sur un serveur distant, utiliser un gestionnaire de processus (pm2, forever...) pour lancer et manager l'app localement, et configurer votre serveur web (Apache, Nginx...) comme proxy pour pointer sur l'application.

### Vérification

Une fois la BDD Neo4j et l'application web lancées, vous pouvez vérifier que tout se passe bien en ouvrant http://localhost:9000/api/test si vous êtes en local, ou http(s): //<votre_nom_de_domaine>/api/test dans un navigateur.

## Création du graphe/chargement des données

### Fichier des ppn unicas

Cette partie est la seule phase manuelle de récupération de données, puisque le seul moyen d'obtenir une liste de ppn pour le corpus des unicas pour l'ILN du CR est de l'exporter manuellement (en format csv) depuis le guicher AbBESstp -> sudoc (espace pro) -> SELF Sudoc.

Déposez ensuite ce fichier dans <NEO4J_HOME>/import

### Alimentation automatisée de la bdd

La succession des requêtes Cypher à appliquer est ensuite documentée dans un Gist dédié, dont certains paramètres sont à personnaliser en fonction de votre ILN.

[https://gist.github.com/gegedenice/c7e53cc4c3d65b8bc1639d4b55a90be6](https://gist.github.com/gegedenice/c7e53cc4c3d65b8bc1639d4b55a90be6)
