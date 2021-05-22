const {openDb} = require("./db")

const tablesNames = ["identifiants", "liens", "commentaires"]


async function createIdentifiants(db){
    const insertRequest = await db.prepare("INSERT INTO identifiants(identifiant_username, identifiant_mail, identifiant_password) VALUES(?, ?, ?)")
    const contents = [{
        identifiant_username: "bob",
        identifiant_mail: "bob@gmail.com",
        identifiant_password: "bob"
    },
    {
        identifiant_username: "max",
        identifiant_mail: "max@gmail.com",
        identifiant_password: "max"
    }]
    return await Promise.all(contents.map(identifiants => {
        return insertRequest.run([identifiants.identifiant_username, identifiants.identifiant_mail, identifiants.identifiant_password])
    }))
}


async function createLiens(db){
    const insertRequest = await db.prepare("INSERT INTO liens(lien_id, lien_contenu, lien_pseudo) VALUES(?, ?, ?)")
    const contents = [{
        lien_id: 1,
        lien_contenu: "http://google.fr",
        lien_pseudo: "max"
    }]

    return await Promise.all(contents.map(liens => {
        return insertRequest.run([liens.lien_id, liens.lien_contenu, liens.lien_pseudo])
    }))
}


async function createCommentaires(db){
    const insertRequest = await db.prepare("INSERT INTO commentaires(commentaire_id, commentaire_contenu, commentaire_lien, commentaire_pseudo) VALUES(?, ?, ?, ?)")
    const contents = [{
        commentaire_id: 1,
        commentaire_contenu: "Excellent site pour faire des recherches!",
        commentaire_lien: 1,
        commentaire_pseudo: "bob"
    }]
    return await Promise.all(contents.map(commentaires => {
        return insertRequest.run([commentaires.commentaire_id, commentaires.commentaire_contenu, commentaires.commentaire_lien, commentaires.commentaire_pseudo])
    }))
}


async function createTables(db){
    const identifiants = db.run(`
        CREATE TABLE IF NOT EXISTS identifiants(
            identifiant_username varchar(255) PRIMARY KEY,
            identifiant_mail varchar(255),
            identifiant_password varchar(255)
        )
    `)
    
    const liens = db.run(`
        CREATE TABLE IF NOT EXISTS liens(
            lien_id INTEGER PRIMARY KEY,
            lien_contenu text,
            lien_pseudo varchar(255),
            FOREIGN KEY(lien_pseudo) REFERENCES identifiants(identifiant_username)
        )
    `)

    const commentaires = db.run(`
        CREATE TABLE IF NOT EXISTS commentaires(
            commentaire_id INTEGER PRIMARY KEY,
            commentaire_contenu text,
            commentaire_lien text,
            commentaire_pseudo varchar(255),
            FOREIGN KEY(commentaire_lien) REFERENCES liens(lien_id),
            FOREIGN KEY(commentaire_pseudo) REFERENCES identifiants(identifiant_username)
        )
    `)
    return await Promise.all([identifiants, liens, commentaires])
}
  
async function dropTables(db){
    return await Promise.all(tablesNames.map( tableName => {
        return db.run(`DROP TABLE IF EXISTS ${tableName}`)
    }
    ))
}

(async () => {
    // open the database
    let db = await openDb()
    await dropTables(db)
    await createTables(db)
    await createIdentifiants(db)
    await createLiens(db)
    await createCommentaires(db)
})()