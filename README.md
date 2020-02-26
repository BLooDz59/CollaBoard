# CollaBoard
Collaborative Board Web Project
## Features
### Added
- Le rédacteur génère une URL pour la session donnant le droit rédacteur
- côté rédacteur : utiliser les événements souris pour capter des tracés
- utiliser le canvas HTML5 pour le rendu
- utiliser json pour transmettre des données vers le serveur
- le serveur contrôle l’unicité du rédacteur pour une session donnée
- clients multiples reçoivent les tracés au moyen de requêtes répétées et les affichent
- évitement des conflits lecteurs / rédacteur
- pas de persistance des tracés côté serveur
- undo, redo multiples
- arrivée en retard
- stylo, couleur, épaisseur
- gomme
- surligneur, couleur épaisseur
- il transmet (par un moyen ad hoc) une URL réduite qui donne le droit lecteur
- multipage
- navigation rédacteur
- navigation lecteur, resynchro rédacteur
- undo/redo sync with clients
- un client dédié se charge de sauvegarder les tracés à la volée
- il les convertit en PDF
### Working On
- pointeur laser (tablette)
## Installation
To install, first clone this repository. Then run `npm install` and `node server.js`.
