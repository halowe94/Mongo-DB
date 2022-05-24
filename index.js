//open terminal
//type npm init -y
//type npm install express
//create a variable called express and require 'express'
const express = require('express');

//create a variable called app and set it equal to express()
const app = express();

//create a variable called port and set it equal to 3000
const port = 3000;

const sqlite3 = require('sqlite3').verbose();


function connectToDB () {
    return new sqlite3.Database('./notes.db', function (err) {
        if (err) {
            console.error(err.message)
        }
        else {
            console.log('The Notes SQLite Database is now open and connected')
        }
    });
}

function disconnectFromDB(db){
    db.close(function(err){
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("The Notes SQLite database was successfully closed.")
        }
    })
}


const db = connectToDB();

db.serialize(function(){
    db.run("CREATE TABLE IF NOT EXISTS 'notes' ('uid' INTEGER PRIMARY KEY AUTOINCREMENT, 'note' TEXT)", [], function(err){
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('"notes" table exists');
        }
    })
});

disconnectFromDB(db);

app.use(express.json());
//routes
app.post('/api/note', (req, res) => {
    
    const db = connectToDB();

    db.serialize(function () {
        db.run("INSERT INTO 'notes' (note) VALUES (?)", [req.body.noteContents],
        function(err){
            if (err) {
                console.error(err.message)
            }
            else {
                res.status(201).send("" + this.lastID)
            }
        })
    });
    
    disconnectFromDB(db);

})


app.get('/api/note/:uid', (req, res) => {
       
    const db = connectToDB();
    db.serialize(function(){
        db.get("SELECT note FROM notes WHERE uid = (?)", [req.params.uid]
        , function (err, row){
            if (err) {
                console.error(err.message)
            }
            else {
                res.send(row.note)
            }
        })
    })
    
    disconnectFromDB(db);

})

app.put('/api/note/:uid', (req, res) => {
    const db = connectToDB();
    db.serialize(function(){
        db.run("UPDATE notes SET note = (?) WHERE uid = (?)", [req.body.noteContents, req.params.uid]
        , function (err){
            if (err) {
                console.error(err.message)
            }
            else {
                res.sendStatus(200)
            }
        })
    })
    
    disconnectFromDB(db);
})

app.delete('/api/note/:uid', (req, res) => {
    const db = connectToDB();
    db.serialize(function(){
        db.run("DELETE FROM notes WHERE uid = (?)", [req.params.uid]
        , function (err){
            if (err) {
                console.error(err.message)
            }
            else {
                res.sendStatus(200)
            }
        })
    })
    
    disconnectFromDB(db);
})

app.get('/api/notes', (req, res) => {
    const db = connectToDB();
    db.serialize(function(){
        const noteUIDs = [];
        db.each("SELECT uid FROM notes", [], function(err, row) {
            if (err) {
                console.error(err.message);
            }
            else {
                noteUIDs.push(row.uid)
            }
        }, function (err, amount) {
            if (err) {
                console.error(err.message)
            }
            else {
                res.json(noteUIDs);
            }
        })
    })
    
    disconnectFromDB(db);
})

app.get('/home.html', (req, res) => {
    res.sendFile(__dirname + '/home.html')
})

app.get('/home.js', (req, res) => {
    res.sendFile(__dirname + '/home.js')
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
//Set up a post route for '/api/note' and use res.send to send a string
//Set up a get route for '/api/note/:uid' and use res.send to send a string
//Set up a put route for 'api/note/:uid' and use res.send to send a string
//Set up a delete route for 'api/note/:uid' and use res.send to send a string
//Set up a get route for '/api/notes' and use res.send to send a string
//make sure that your app is listening on the port
//console.log `app listening on ${port}
//run the app from the terminal (node app.js)
