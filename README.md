# Sudoc-PS App
**Application web de visualisation des unicas + presse locale par une modélisation en graphe avec Neo4j**

## Instance Neo4j

* Gist des requêtes pour le chargement des données : [https://gist.github.com/gegedenice/c7e53cc4c3d65b8bc1639d4b55a90be6](https://gist.github.com/gegedenice/c7e53cc4c3d65b8bc1639d4b55a90be6)

* Les paramètres de connexion à la bdd (à personnaliser) sont dans 
   * /api/models/db.js pour le backend
   * /app/scripts/controllers/graphevis.js pour la visualisation du graphe en frontend

## Installation

* Download ou clone du dépôt

* npm install

* bower install

## Version de dev (local)

Pour lancer l'app en mode watch : npm run dev (écoute sur le port localhost:9000)

## Sur serveur

Par exemple avec le gestionnaire d'app node.js [pm2](https://pm2.keymetrics.io/) : pm2 start server.js
