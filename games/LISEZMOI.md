# Ajouter un jeu / platforme 

[Français](LISEZMOI.md) | [English](README.md)

Tout se passe dans le dossier `games` qui est séparé de cette manière :
 - 1 fichier pour chaque jeu.
 - 1 sous-dossier `class` pour les classes ou libs personnalisées.
 - 5 sous-dossiers (qui contiennent également  un fichier pour chaque jeu).
    - [`api`](#fichier-du-jeu-dans-api) : Récupération et mise à jour des données de jeu.
    - [`functions`](#fichier-du-jeu-dans-functions) : Fonctions spécifiques à un jeu.
    - [`settings`](#fichier-du-jeu-dans-settings) : Réglages de compte du jeu.
    - [`tags`](#fichier-du-jeu-dans-tags) : Réglages des tags (donnée) du jeu.
    - [`tests`](#fichier-du-jeu-dans-tests) : Réglages des tests des tags (données) du jeu.



## Fichier principal du jeu : `<GAME_ID>.js`
❗ Nom du fichier : `<GAME_ID>.js`
> Chemin : `/games/<GAME_ID>.js`

Fichier **javascript** qui contient les settings de base du jeu.

- **icon** : Chemin vers l'icone du jeu (PNG | ~200x200) [/public/images/game/<GAME_ID>](../public/images/game).
- **image** : Chemin vers l'image du jeu (PNG | Doit faire comprendre de quel jeu il s'agit et doit être une image longue et horizontale) [/public/images/game/<GAME_ID>](../public/images/game)
- **ratelimit** : ❗ Important : Toujours laisser de la marge avec les ratelimits imposées par le jeu (~15%)
- Pour le reste voir fichier d'[exemple](game.js.example)

Exemples : 
- [/games/game.js.example](game.js.example)
- [/games/lol.js](lol.js)
- [/games/speedrun.js](speedrun.js)



## Sous-dossier `class`
> Chemin : `/games/class/`

Dossier pour ajouter ses propres libs, nom de fichier libre (nom unique).

(Accessible dans le code depuis `Server.class.game.<FILE_NAME>`)

Exemple : [/games/class/OPGG.js](class/OPGG.js)



## Fichier du jeu dans `api`
❗ Nom du fichier : `<GAME_ID>.js`
> Chemin : `/games/api/<GAME_ID>.js`


Fichier **javascript** permettant de récupérer les données (tags) du jeu. 

Séparé en 3 **functions** et un **object** generator :
- **getAccountInfo** : Fonction appelée lors de l'ajout d'un compte. Permet de recuperer les infos d'un compte (id, region..).
    - Success : *Resolve* un `object` qui contient les infos du compte (id, region..)
    - Error :
        - *Resolve* `null` si le compte ajouté est incorrect (ex: mauvais pseudo, n'existe pas)
        - *Reject* une error si erreur serveur (ex: request timeout) 
- **getDataOneByOne** : Fonction qui permet de recuperer et de mettre a jour les données de jeu des tags de l'utilisateur.
    - ❗ Important : Utiliser la fonction `await Server.fn.game.utils.useMeBeforeEachRequest` avant chaque request de jeu.
    - ❗ Important : Utiliser la fonction `Server.fn.game.utils.useMeAfterEachRequest` apres chaque request de jeu.
- **updateFullGameData** : *[Peut être copié sans modification]* À modifier uniquement si une optimisation est nécessaire (ex: batch). Fonction qui va appeler `getDataOneByOne` pour toutes les données de jeu à mettre à jour.
- **generator** : *[Peut être copié sans modification]* Object qui contient des fonctions qui permetront de generer les données en fonction des reglages du tag. Appelle les fonctions spécifiques à chaque réglage de tag/données. (voir [tags](#fichier-du-jeu-dans-tags)).

Exemples : 
- [/games/api/game.js.example](api/game.js.example)
- [/games/api/lol.js](api/lol.js)
- [/games/api/speedrun.js](api/speedrun.js)



## Fichier du jeu dans `settings`
❗ Nom du fichier : `<GAME_ID>.js`
> Chemin : `/games/settings/<GAME_ID>.js`

Fichier **javascript** qui contient les réglages du compte (game account), objet utilisé pour generer le formulaire d'ajout/modification de compte.

Chaque `key: value` correspond à un réglage (ex: username, région..).

Chaque réglage doit posséder : 
- **label** : Texte qui sera affiché devant l'input.
- **tooltip** (peut etre `false`) : Affiche une petite icône d'aide avec plus d'informations.
- **type** : Type de l'input (*string* ou *select*).
- **input** : Contenu de l'input en fonction du type (ex: Object avec les differents choix pour le type *select*).

Exemples : 
- [/games/settings/game.js.example](settings/game.js.example)
- [/games/settings/lol.js](settings/lol.js)
- [/games/settings/speedrun.js](settings/speedrun.js)



## Fichier du jeu dans `tags`
❗ Nom du fichier : `<GAME_ID>.js`
> Chemin : `/games/tags/<GAME_ID>.js` 

Fichier **javascript** qui contient les réglages/fonctions des tags/donnés de jeu. Séparé en 5 parties pour éviter la duplication de code (car beaucoup de réglages sont utilisés plusieurs fois).
- **DATA FORMAT SETTINGS** : Partie qui contient les paramètres de formatage des données (modification du texte, taille....).
- **DATA SETTINGS** : Partie qui contient les réglages appliqués au moment de la récupération des données (ex: saison, categorie..).
- **DATA FUNCTIONS** : Partie qui contient les fonctions à appliquer sur les données en fonction des réglages.
- **DATA EXAMPLES** : Partie qui contient les données d'examples.
- **TAGS** : Liste des tags avec leurs info/réglages (Objects `TAG_ID:TAG_SETTINGS`).


Un tag est composé de :
- **id** : Un identifiant unique (ex: `SPEEDRUN__PB__RANK`).
    - norme : `<GAME_ID>__<CATEGORY_SMALL>__<NAME_SMALL>`
- **gameID** : ID du jeu (ex: `speedrun`).
- **category** : Nom complet de la categorie (ex: `Ranked Solo Summoner\'s Rift`).
- **categorySmall** : Nom court de la categorie (ex: `Ranked Solo SR`).
- **name** : Nom complet du tag (ex: `Winrate`).
- **nameSmall** : Nom court du tag (ex: `WR`).
- **size** : Taille par defaut du tag dans le profil (Taille max d'une donnée avec les reglages de base).
- **account** : (`true` ou `false`) Si le tag a besoin d'un compte pour fonctionner.
- **useExample** : (`true` ou `false`) Si le tag doit utiliser un exemple au lieu de faire des requêtes pour obtenir les données lorsque le tag est ajoutée. Mettre à `true` si les ratelimits sont très stricts.
- **fieldSettings** : Réglages utilisés pour generer le formulaire d'ajout/modification de tag. Réglages de formatage des données (modification du texte, taille...) (modification de texte, taille..) (`SETTING_ID: SETTING_OBJECT`). Chaque réglage est composé de :
    - **label** : Texte qui sera affiché devant l'input.
    - **tooltip** (peut etre `false`) : Affiche une petite icône d'aide avec plus d'informations.
    - **type** : Type de l'input (*select*).
    - **input** : Contenu de l'input en fonction du type (ex: Object avec les differents choix pour le type *select*).
- **dataSettings** : Réglages utilisés pour generer le formulaire d'ajout/modification de tag. Réglages appliqués au moment de la récupération des données (ex: saison, categorie..) (`SETTING_ID: SETTING_OBJECT`). Chaque réglage est composé de :
    - **label** : Texte qui sera affiché devant l'input.
    - **tooltip** (peut etre `false`) : Affiche une petite icône d'aide avec plus d'informations.
    - **type** : Type de l'input (*select*).
    - **input** : Contenu de l'input en fonction du type (ex: Object avec les differents choix pour le type *select*).
        - Chaque input contient une `value` qui +/- la taille de la donnée (ex pour un reglage *short*: `value: -4`)
- **settingsOrder** : Ordre dans lequel les réglages (❗ uniquement les réglages de formatage/*fieldSettings*) doivent être appliqués (ex: `['size', 'format']`).
- **generator** : Fonction du générateur de données à appeler. `default` si aucune modification apportée au générateur (ex: `default`).
- **data** : Object qui contient, pour chaque réglage, des fonctions utilisés pour formater la donnée (❗ uniquement les réglages de formatage/*fieldSettings*) (`SETTING_ID: SETTING_OBJECT`). Chaque réglage est composé d'une fonction par valeur.

    Exemple pour un réglage `size` (qui contient `default`, `withPercentSpace` et `withPercentNoSpace`) : 
    ```js
    size: {
        default: data => data,
        withPercentSpace: data => data + ' %',
        withPercentNoSpace: data => data + '%'
    }
    ```
- **exampleOriginal** : Donnée d'example originale (ex: `DIAMOND`)
- **example** : Object qui contient toutes les données d'exemples pour toutes les combinaisons possibles (En respectant l'ordre). 

    Exemple pour un tag qui a les réglages `size` (qui contient `default` et `short`) et `format` (qui contient `default`, `uppercase`, `lowercase` et `capitalize`) : 
    ```js
    size: { // setting PROPERTY
        default: { // setting VALUE
            format: { // setting PROPERTY
                default: 'DIAMOND', // setting VALUE
                uppercase: 'DIAMOND', // setting VALUE
                lowercase: 'diamond', // setting VALUE
                capitalize: 'Diamond' // setting VALUE
            }
        },
        short: { // setting VALUE
            format: { // setting PROPERTY
                default: 'DIAM', // setting VALUE
                uppercase: 'DIAM', // setting VALUE
                lowercase: 'diam', // setting VALUE
                capitalize: 'Diam' // setting VALUE
            }
        }
    }
    ```

Exemples : 
- [/games/tags/game.js.example](tags/game.js.example)
- [/games/tags/lol.js](tags/lol.js)
- [/games/tags/speedrun.js](tags/speedrun.js)



## Fichier du jeu dans `functions`
❗ Nom du fichier : `<GAME_ID>.js`
> Chemin : `/games/functions/<GAME_ID>.js`

Fichier **javascript** qui contient les fonctions liées au jeu. Séparé du fichier [api](#fichier-du-jeu-dans-api) pour plus de propreté.

Exemples : 
- [/games/functions/lol.js](functions/lol.js)
- [/games/functions/speedrun.js](functions/speedrun.js)



## Fichier du jeu dans `tests`
❗ Nom du fichier : `<GAME_ID>.js`
> Chemin : `/games/tests/<GAME_ID>.js`

Fichier **javascript** qui contient les données et les reglages des tests de tags liées au jeu. (Export object vide pour faire uniquement les tests des reglages par default)

Exemples : 
- [/games/tests/lol.js](tests/lol.js)
- [/games/tests/speedrun.js](tests/speedrun.js)
