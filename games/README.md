# Comment ajouter un jeu 


Tout se passe dans le dossier `games` 


Il séparé de cette manière :
 - 1 fichier pour chaque jeu.
 - 1 sous-dossier `class` pour les classes ou libs personnalisées.
 - 4 sous-dossiers (qui contiennent également  un fichier pour chaque jeu).
    - `api` : Récupération et mise à jour des données de jeu
    - `functions` : Fonctions spécifiques à un jeu
    - `settings` : Réglages de compte du jeu
    - `tags` : Réglages des tags (donnée) du jeu



## Fichier principal du jeu : `<GAME_ID>.js`
❗ Nom : `<GAME_ID>.js`
> Chemin : `/games/<GAME_ID>.js`

Fichier **javascript** qui contient les settings de base du jeu.

- **icon** : Chemin vers l'icone du jeu (PNG ~200x200) [/public/images/game/<GAME_ID>](../public/images/game)
- **image** : Chemin vers l'image du jeu (PNG Doit faire comprendre de quel jeu il s'agit et doit être dans une forme longue horizontale) [/public/images/game/<GAME_ID>](../public/images/game)
- **ratelimit** : ❗ Important : Toujours laisser de la marge avec les ratelimits imposées par le jeu (~15%)
- Pour le reste voir fichier d'[exemple](game.js.example)

Exemples : 
- [/games/game.js.example](game.js.example)
- [/games/lol.js](lol.js)
- [/games/speedrun.js](speedrun.js)



## Sous-dossier `class`
> Chemin : `/games/class/`

Dossier pour ajouter ses propres libs, nom de fichier libre.

(Accessible dans le code depuis `Server.class.game.<FILE_NAME>`)

Exemple : [/games/class/OPGG.js](class/OPGG.js)



## Fichier du jeu dans `api`
❗ Nom : `<GAME_ID>.js`
> Chemin : `/games/api/<GAME_ID>.js`


Fichier **javascript** permettant de récupérer les données du jeu. Séparé en 3 **functions** et un **object** generator.

- **getAccountInfo** : Fonction appelée lors de l'ajout d'un compte. Permet de recuperer les infos d'un compte (id, region..).
    - Success : *Resolve* un `object` qui contient les infos du compte (id, region..)
    - Error :
        - *Resolve* `null` si le compte ajouté est incorrect 
        - *Reject* une error si erreur serveur (ex: request timeout) 
- **getDataOneByOne** : Fonction qui permet de recuperer et de mettre a jour les données de jeu des tags de l'utilisateur.
    - ❗ Important : Utiliser la fonction `await Server.fn.game.utils.useMeBeforeEachRequest` avant chaque request de jeu.
    - ❗ Important : Utiliser la fonction `Server.fn.game.utils.useMeAfterEachRequest` apres chaque request de jeu.
- **updateFullGameData** : *[Peut être copié sans modification]* À modifier uniquement si une optimisation est nécessaire. (ex: batch) Fonction qui va appeler `getDataOneByOne` pour toutes les données de jeu à mettre à jour.
- **generator** : *[Peut être copié sans modification]* Object qui contient des fonctions qui permetront de generer les données en fonction des reglages de l'utilisateur. Vont appeller les fonctions specifique a chaque settings de tag/donnée (voir [tags](#fichier-du-jeu-dans-tags))

Exemples : 
- [/games/api/game.js.example](api/game.js.example)
- [/games/api/lol.js](api/lol.js)
- [/games/api/speedrun.js](api/speedrun.js)



## Fichier du jeu dans `tags`
❗ Nom : `<GAME_ID>.js`
> Chemin : `/games/tags/<GAME_ID>.js` 



## Fichier du jeu dans `functions`
❗ Nom : `<GAME_ID>.js`
> Chemin : `/games/functions/<GAME_ID>.js`

Fichier **javascript** qui contient les fonctions liées au jeu. Séparé du fichier [api](#fichier-du-jeu-dans-api) pour plus de propreté.

Exemples : 
- [/games/functions/lol.js](functions/lol.js)
- [/games/functions/speedrun.js](functions/speedrun.js)

## Fichier du jeu dans `settings`
❗ Nom : `<GAME_ID>.js`
> Chemin : `/games/settings/<GAME_ID>.js`

Fichier **javascript** qui contient les réglages du compte (game account), object utilisé pour generer le formulaire d'ajout/modification de compte.

Chaque `key: value` correspond à un réglage (ex: username, région..).

Chaque réglage doit posséder : 
- label : Texte qui sera affiché devant l'input
- tooltip (peut etre `false`) : Affiche une petite icône d'aide avec plus d'informations
- type : Type de l'input (*string* ou *select*)
- input : Contenu de l'input en fonction du type (ex: Object avec les differents choix pour le type *select*)

Exemples : 
- [/games/settings/game.js.example](api/game.js.example)
- [/games/settings/lol.js](functions/lol.js)
- [/games/settings/speedrun.js](functions/speedrun.js)