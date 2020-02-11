# CollaBoard
Collaborative Board Web Project
## Features
### Added
- Le rédacteur génère une URL pour la session donnant le droit rédacteur
- côté rédacteur : utiliser les événements souris pour capter des tracés
-  utiliser le canvas HTML5 pour le rendu
- utiliser json pour transmettre des données vers le serveur
- le serveur contrôle l’unicité du rédacteur pour une session donnée
-  clients multiples reçoivent les tracés au moyen de requêtes répétées et les affichent
-  évitement des conflits lecteurs / rédacteur
- pas de persistance des tracés côté serveur
### Working On
- il transmet (par un moyen ad hoc) une URL réduite qui donne le droit lecteur
- un client dédié se charge de sauvegarder les tracés à la volée
- il les convertit en PDF
- stylo, couleur, épaisseur
- surligneur, couleur épaisseur
- gomme, pointeur laser (tablette)
- undo, redo multiples
- multipage
- navigation rédacteur
- navigation lecteur, resynchro rédacteur
- arrivée en retard
## Installation
To install, first clone this repository. Then run `npm install` and `node server.js`.
