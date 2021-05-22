const express = require('express')
const {openDb} = require("./db")

const session = require('express-session')
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const SQLiteStore = require('connect-sqlite3')(session);
const port = 3000
const sess = {
    store: new SQLiteStore,
    secret: 'secret key',
    resave: true,
    rolling: true,
    cookie: {
      maxAge: 1000 * 3600//ms
    },
    saveUninitialized: true
}


if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}


app.use(session(sess))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'jade');


// Pour vérifier si l'adresse mail saisie par l'utilisateur
function valid_address(adresse){
    let indice = adresse.indexOf("@gmail.com")
    if (indice !== -1){
        if (indice == adresse.length-10)
            return 1
    }
    else return 0
}


app.get('/', async (req, res) => {

    const db = await openDb()

    const identifiants = await db.get(`
    SELECT * FROM identifiants
    `)

    res.render('login', {identifiants, logged: req.session.logged, user: req.session.user})
})


app.get('/signup', async (req, res) => {

    const db = await openDb()

    const identifiants = await db.get(`
    SELECT * FROM identifiants
    `)

    res.render('signup', {identifiants, signed_up: req.session.signed_up, logged: req.session.logged})
})

app.get('/profile', async (req, res) => {

    if(!req.session.logged){
        res.redirect(302,'/')
        return
    }
    const username = req.session.user

    const db = await openDb()
    
    // Pour avoir tous les liens commentés par l'utilisateur 
    const all_comments = await db.all(`
    SELECT * FROM commentaires
    JOIN liens on liens.lien_id = commentaires.commentaire_lien
    LEFT JOIN identifiants on identifiants.identifiant_username = commentaires.commentaire_pseudo
    WHERE commentaire_pseudo = ?
    `,[username])

    const identifiants = await db.all(`
    SELECT * FROM identifiants
    `)
    
    res.render('profile', {identifiants, liens: req.session.links, all_comments, logged: req.session.logged, user: req.session.user, address: req.session.mail})
})



app.get('/home', async(req, res) => {

    if(!req.session.logged){
        res.redirect(302,'/')
        return
    }
    const db = await openDb()
    const identifiants = await db.all(`
    SELECT * FROM identifiants
    `)
    const links = await db.all(`
    SELECT * FROM liens
    `)
    const commentaires = await db.all(`
    SELECT * FROM commentaires
    `)
    res.render('home', {posted: req.session.posted, identifiants, links, commentaires, logged: req.session.logged, user: req.session.user})
})


app.get('/link/:id', async(req, res) => {

    const db = await openDb()

    if(!req.session.logged){
        res.redirect(302,'/')
        return
    }

    const id = req.params.id

    res.render('link', {id, logged: req.session.logged, commented: req.session.commented, link_comments: req.session.link_comments, link_user: req.session.link_user, link_content: req.session.link_content})
})


app.post('/', async (req, res) => {

    if (!req.session.logged){

        const mail = req.body.mail
        const password = req.body.password

        const db = await openDb()

        const identifiants = await db.get(`
        SELECT * FROM identifiants
        `)

        const adresses_mail = await db.all(`
        SELECT identifiant_mail FROM identifiants
        `)

        let data = {}

        if (mail && password){
            if (!valid_address(mail)) {
                data = {
                    errors: "L'adresse mail saisie n'est pas valide (adresse gmail uniquement).",
                    logged: false
                }
            }
            else if (adresses_mail){
                let test = 0;
                for (let i = 0; i<adresses_mail.length; i++){
                    if (adresses_mail[i].identifiant_mail ===mail) {
                        test = 1
                    }
                }
                if (!test){
                    data = {
                    errors: "Aucun compte n'est associé à cette adresse mail.",
                    logged: false
                    }
                }
                else{
                    let test2 = 0;
                    const mots_de_passe = await db.all(`
                    SELECT identifiant_password FROM identifiants 
                    WHERE identifiant_mail = ?
                    `,[mail])
                    mots_de_passe.forEach(element => test = (element.identifiant_password===password))
                    if (!test){
                        data = {
                            errors : "Le mot de passe saisi est incorrect.",
                            logged : false
                        }
                    }
                    else{
                        req.session.logged = true
                        req.session.mail = mail
                        const object_user = await db.get(`
                        SELECT identifiant_username FROM identifiants
                        WHERE identifiant_mail = ?
                        `,[mail])
                        req.session.user = object_user.identifiant_username
                        data = {
                            success: "Vous êtes log",
                            logged: true,
                        }
                    }
                }
            }
        }
        res.render('login',data)
    }
    else
        res.redirect(302,'/')
})


app.post('/signup', async (req, res) => {

    const username = req.body.username
    const mail = req.body.mail
    const password = req.body.password
    const password_confirm = req.body.password_confirm

    const db = await openDb()

    const pseudos = await db.all(`
    SELECT identifiant_username FROM identifiants
    `)

    const mails = await db.all(`
    SELECT identifiant_mail FROM identifiants
    `)

    let data = {}

    if (username && mail && password && password_confirm){
        let test1= 0
        for (let i = 0; i<pseudos.length; i++){
            if (pseudos[i].identifiant_username ===username) {
                test1 = 1
            }
        }
        let test2 = 0
        for (let i = 0; i<mails.length; i++){
            if (mails[i].identifiant_mail ===mail) {
                test2 = 1
            }
        }
        if(test1) {
            data = {
                errors: "Le pseudo existe déjà.",
                signed_up: false
            }
        }
        else if(test2) {
            data = {
                errors: "L'adresse mail est déjà utilisée.",
                signed_up: false
            }
        }
        else if(username.length < 4) {
            data = {
                errors: "Le pseudo doit contenir plus de 4 caractères.",
                signed_up: false
            }
        }
        else if (!valid_address(mail)){
            data = {
                errors : "L'adresse mail n'est pas valide (doit être sous la forme @gmail.com).",
                signed_up : false
            }
        } 
        else if (password.length < 6){
            data = {
                errors : "Le mot de passe doit contenir plus de 6 caractères.",
                signed_up : false
            }
        }
        else if (password_confirm !== password){
            data = {
                errors : "Les mots de passe saisis ne sont pas identiques.",
                signed_up : false
            }
        }
        else{
            identifiants = await db.run(`
                INSERT INTO identifiants(identifiant_username,identifiant_mail,identifiant_password)
                VALUES(?, ?, ?)
                `,[username, mail, password])
            req.session.signed_up = true
            data = {
                success: "Vous êtes inscrit",
                signed_up: true
            }
        }
    }
    res.render('signup',data)
})


app.post('/logout',(req, res) => {

    req.session.logged = false
    res.redirect(302,'/')
})

app.post('/profile', async (req, res) => {

    const db = await openDb()
    const username = req.session.user

    const identifiants = await db.all(`
    SELECT * FROM identifiants
    `)

    const links = await db.all(`
    SELECT lien_contenu FROM liens
    LEFT JOIN identifiants on identifiants.identifiant_username = liens.lien_pseudo
    WHERE lien_pseudo = ?
    `,[username])

    const all_comments = await db.all(`
    SELECT * FROM commentaires
    JOIN liens on liens.lien_id = commentaires.commentaire_lien
    LEFT JOIN identifiants on identifiants.identifiant_username = commentaires.commentaire_pseudo
    WHERE commentaire_pseudo = ?
    `,[username])

    let links_array = []
    for(let i=0; i<links.length; i++) 
        links_array.push(links[i].lien_contenu)

    // inverser les listes de liens commentés et publiés pour les visualiser de manière antichronologique
    links_array.reverse()
    all_comments.reverse()

    req.session.links = links_array;

    res.render('profile', {identifiants, all_comments, liens: req.session.links, logged: req.session.logged, user: req.session.user, address: req.session.mail})
})




app.post('/home', async(req, res) => {

    req.session.posted = false
    if(!req.session.logged){
        res.redirect(302,'/')
        return
    }
    const link = req.body.link
    const username = req.session.user
    const db = await openDb()

    const identifiants = await db.all(`
    SELECT * FROM identifiants
    `)

    const links = await db.all(`
    SELECT * FROM liens
    `)

    const id_link = links.length + 1

    const commentaires = await db.all(`
    SELECT * FROM commentaires
    `)
    if (link){
        liens = await db.run(`
        INSERT INTO liens(lien_id,lien_contenu,lien_pseudo)
        VALUES(?, ?, ?)
        `,[id_link, link, username])
        req.session.posted = true
    }

    // Pour afficher les liens publiés par odre antichronologique :
    links.reverse()

    res.render('home', {identifiants, links, commentaires, logged: req.session.logged, user: req.session.user, posted: req.session.posted})
})


app.post('/link/:id', async(req, res) => {

    req.session.commented = false
    const db = await openDb()
    const id = req.params.id

    if(!req.session.logged){
        res.redirect(302,'/')
        return
    }

    const commentaires = await db.all(`
    SELECT * FROM commentaires
    `)

    const link = await db.all(`
    SELECT * from liens 
    WHERE lien_id = ?
    `, [id])

    const link_content = link[0].lien_contenu
    const link_user = link[0].lien_pseudo
    const comment_id = commentaires.length + 1

    const link_comments = await db.all(`
    SELECT * from commentaires 
    JOIN liens on commentaires.commentaire_lien = liens.lien_id
    WHERE lien_id = ?
    `, [id])

    if(link_comments){

        const comment_added = req.body.comment
        const username = req.session.user

        if (comment_added){
        comment = await db.run(`
        INSERT INTO commentaires(commentaire_id, commentaire_contenu, commentaire_lien, commentaire_pseudo)
        VALUES(?, ?, ?, ?)
        `,[comment_id, comment_added, id, username])
        req.session.commented = true
        }
    }

    req.session.link_comments = link_comments
    req.session.link_content = link_content
    req.session.link_user = link_user
 
    res.render('link', {id, commented: req.session.commented, id, link_comments, link_content, link_user, logged: req.session.logged})
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})