// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://cfastudentuser:<password>@cluster0.l0z0w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

//deleted index.js
//deleted notes db

const express = require('express');
const app = express();
const port = 3000;


require('dotenv').config()
const {MongoClient, ServerApiVersion, ObjectId} =
require ('mongodb')

const uri = `mongodb+srv://${process.env.dbUserName}:${process.env.dbUserPassword}@${process.env.dbClusterName}.${process.env.dbMongoId}.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//added this line of code
client.connect(err => {
    const collection = client.db("test").collection("devices");
    //perform actions on the collection object
    client.close();
 });

app.use(express.json());

app.post('/api/note', (req, res) => {

    client.connect ((err, success) => {
        if (success) {
            const collection = 
            client.db(process.env.dbName).collection(process.env.dbCollectionName)
            //missing t from insertOne
            collection.instertOne(req.body, (err, success) => {
                client.close()
                if(success){
                    res.status(201).send(success.insertedId)
                } else {
                    //missing if statement
                    res.status(400).send("Could not fulfill request. The body is not properly formed.")
                    if (err && err.message && err.stack) {
                    console.log(err.message, err.stack)
                 }
                }
            })
        } else {
            client.close()
            res.status(500).send("Could not fulfill request. The server is having issues with the database")
            if (err && err.message && err.stack) {
                console.log(err.message, err.stack)
            }
        }
    })
})

app.get('/api/note/:uid', (req, res) => {
    client.connect ((err, success) => {
        if (success) {
            const collection = client.db(process.env.dbName).collection(process.env.dbCollectionName)
            collection.findOne (
                {
                    _id: ObjectId(req.params.uid)
                },
                (err, success) => {
                    client.close()
                    if (success) {
                        res.status(200).send(success.noteContents)
                    } else {
                        res.status(400).send("Could not fulfill request. The body is not properly formed")
                        if (err && err.message && err.stack) {
                            console.log(err.message, err.stack)
                        }
                    }
                }
            )
        } else {
            client.close()
            res.status(500).send("Could not fulfill request. The server is having issues with the database")
            if (err && err.message && err.stack) {
                console.log(err.message, err.stack)
            }
        }
    })
})

app.put('/api/note/:uid', (req, res) => {
    client.connect ((err, success) => {
        if (success) {
            const collection = client.db(process.env.dbName).collection(process.env.dbCollectionName)
            collection.updateOne (
                {
                    _id: ObjectId(req.params.noteContents)
                },
                {
                    $set:  req.body
                },
                
                (err, success) => {
                    client.close ()
                    if (success) {
                        res.send(req.body.noteContents)
                    } else {
                        res.status(400).send("Could not fulfill request. The body is not properly formed")
                        if (err && err.message && err.stack) {
                            console.log(err.message, err.stack)
                        }
                    }
                }
                
            )
        } else {
            client.close()
            res.status(500).send("Could not fulfill request. The server is having issues with the database")
            if (err && err.message && err.stack) {
                console.log(err.message, err.stack)
            }
        }
    })
})

app.delete('/api/note/:uid', (req, res) => {
    client.connect ((err, success) => {
        if (success) {
            const collection = client.db(process.env.dbName).collection(process.env.dbCollectionName)
            collection.findOneAndDelete({
                _id: ObjectId(req.params.uid)
            }, (err, success) => {
                client.close()
                if(success && success.value) {
                    res.send(success.value.noteContents)
                } else {
                    res.status(400).send("Could not fulfill request. The body is not properly formed")
                    if (err && err.message && err.stack) {
                        console.log(err.message, err.stack)
                    }
                }
            })
        } else {
            client.close()
            res.status(500).send("Could note fulfull request. The server is having issues with the database")
            if (err && err.message && err.stack) {
                console.log(err.message, err.stack)
            }
        }
    })
})

app.get('/api/notes', (req, res) => {
    client.connect((err, success) => {
        //missing if statement 
        //why success and err aren't referenced
        if (success) {
        const collection = client.db(process.env.dbName).collection(process.env.dbCollectionName)
        let results = collection.find (
            {},
            {projection: {_id: 1}}
        )
        .map(x => x._id)
        .toArray()
        .then((success, err) => {
            client.close()
            if (success) {
                res.send(success)
            } else {
                res.status(400).send("Could not fulfill request. The body is not properly formed")
                console.log(err.message, err.stack)
            }
        })
    //added bracket
    //added second else statement
    } else {
        client.close()
        res.status(500).send("Could note fulfill request. The server is having issues with the database.")
        console.log(err.message, err.stack)
    }
    })
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