


Projet Programmation Web 

Réalisé par:
SQUALLI HOUSSAINI Karima
WANKIDA Oumaima

___________________________________________________________________________________________________________________________________________________________

Introduction:


Reddit est un site communautaire permettant d’échanger des liens, les commenter, mais aussi de voter pour les liens les plus intéressants. L’application développée dans ce projet (Read-it)  représente une reproduction d’une partie des fonctionnalités du site Reddit.com utilisant l’architecture dynamique côté serveur, et se basant sur différents langages: HTML5, CSS, Javascript et SQLite. 


Pour lancer le projet la première fois :
```shell
npm install
```
Pour initialiser la base de données
```shell
node install.js
```


Pour lancer le serveur  : 
```shell
node main.js
```

                         __________________________________________________________________________________
                           
                           

Fonctionnalités implémentées:


L’application Web développée permet de créer un compte et de s’authentifier par le biais d’une adresse mail et un mot de passe, d’ajouter des liens, et de visualiser la page de chaque lien posté. Chaque utilisateur a sa propre page de profil contenant ses données, ainsi que l’historique de tous les liens partagés ou commentés par lui. En outre, il a la possibilité de commenter un lien autant de fois qu’il le souhaite.
Voici le détail de toutes les fonctionnalités implémentées:

    1) Inscription:
    La page d'inscription demande à l'utilisateur de saisir ses informations(pseudo, adresse mail, mot de passe et confirmation du mot de passe), elles sont directement stockées dans les tables SQL et lui permettront plus tard de s'authentifier. Les données saisies doivent être valides: Le pseudo doit contenir plus de 4 caractères et doit être unique à chaque utilisateur, l'adresse mail doit être de la forme @gmail.com, le mot de passe doit avoir au minimum 6 caractères et doit être confirmé par une deuxième saisie. Si l'une de ces conditions n'est pas respectée, un message d'erreur s'affiche décrivant à l'utilisateur l'erreur commise. La page d'inscription contient également un bouton permettant d'accéder directement à la page d'authentification si l'utilisateur a déjà un compte.
    
    2) Authentification:
    Pour s'authentifier, l'utilisateur doit fournir son adresse mail et son mot de passe. Si les données ne sont pas correctement informées, l'authentification lui est interdite et des messages d'erreur s'affichent. La page d'authentification contient, elle aussi, un bouton qui permet de rediriger les personnes n'ayant pas encore de compte vers la page d'inscription.
 
    3) Ajouter des liens et les visualiser:
    La page d'accueuil permet à l'utilisateur de poster de nouveaux liens et de visualier des liens déjà publiés (affichage anti-chronologique). Chaque lien a sa propre page pour consulter ses commentaires et en ajouter. En revanche, la suppression, l'upvote/downvote et la modification des liens et des commentaires n'ont pas été implémentés.
    
    4) Page de profil:
    Chaque utilisateur possède sa propre page de profil avec ses données, elle contient également l'historique de tous les liens qu'il a postés auparavant, ainsi que les liens qu'il a commentés. Pareillement à la page d'accueil, l'affichage se fait de manière anti-chronologique.
    
    5) Déploiement:
    Les tables nécessaires à notre application WEB ont été créées (identifiants, liens, commentaires). Deux utilisateurs ont été initialisés: max d'adresse mail max@gmail.com et de mot de passe bob, ayant dans son historique de liens un partage du site http://google.fr, et bob/bob@gmail.com/bob, son historique de commentaires contient une réaction au lien de Max. En revanche, les upvotes de chacun de ses deux utilisateurs n'ont pas été implémentés. 
    
    
    
    

                          ___________________________________________________________________________________
   
   

Architecture:


La gestion des fonctionnalités citées au dessus se fait dans différents fichiers :

    1) src/views/login.jade : code HTML et CSS qui permet de représenter le contenu de la page d’authentification et la mettre en forme.
       
    2) src/views/signup.jade : code HTML et CSS qui permet de représenter le contenu de la page d’inscription et la mettre en forme.
       
    3) src/views/profile.jade : code HTML et CSS qui permet de représenter le contenu de la page de profil de l’utilisateur et la mettre en forme.
       
    4) src/views/home.jade : code HTML et CSS qui permet de représenter le contenu de la page d’accueil du site Read-it et la mettre en forme.

    5)  src/views/link.jade : code HTML et CSS qui permet de visualiser un lien et ses commentaires, ainsi que d'y ajouter autant de commentaires que l'on veut.

    6) src/views/laayout.jade : code HTML et CSS regroupant le header et une partie du body communs aux pages gérées dans les fichiers précédents.
       
    7) src/install.js : code Javascript qui permet la création des différentes tables SQL utilisées dans le site Web (identifiants,  liens, commentaires),  et l’initiation des données relatives aux utilisateurs Max et Bob.
       
    8) src/main.js : code Javascript qui permet la gestion de toutes les données des utilisateurs, remplissant les tables SQL à chaque nouveau compte créé, il permet aussi la conservation des informations de manière locale grâce au middleware express_session.
    
    9) src/db.js : code Javascipt qui exporte le module SQLite3 dans le main.
   Et enfin, le dossier src/public/images qui contient toutes les images utilisées dans le site Read-It.



               _______________________________________________________________________________________________________


Conclusion:


Grâce à ce projet, nous avons pu approfondir différentes notions de programmation WEB étudiées en cours et les mettre en pratique afin de concevoir une application WEB.Il nous a aussi permis d'apprendre à collaborer et répartir les tâches afin d'atteindre l'objectif voulu, chose qui a développé nos compétences sociales et amélioré notre aptitude à travailler en groupe.
