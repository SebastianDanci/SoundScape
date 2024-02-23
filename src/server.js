import express from 'express';
import cors from 'cors';
import childprocess from 'child_process';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const app = express();
const studentIdPath = '/M00886707';
app.use(cors()); // Enable CORS for all routes
app.use(express.static("./"));
app.use(bodyParser.json())

const connectionURI = "mongodb+srv://SebastianD:nfmOGw5BxTtTX4Ke@coursework.zpidlav.mongodb.net/?retryWrites=true&w=majority&appName=Coursework";

const client = new MongoClient(connectionURI, {
    serverAPI: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors:true,
    }
});

const database = client.db("SoundScape");
const collection = database.collection("Users");

// GET Endpoint to get Users
app.get(studentIdPath + '/getUsers', async (req, res) => {
    try {
        await client.connect();
        
        const query = {};
        const results = await collection.find(query).toArray();
        
        res.status(200).json(results); 
    } catch (error) {
        res.status(500).send("An error occurred while fetching users");
        console.error(error);
    } finally {
        await client.close(); 
    }
});

app.post(studentIdPath + '/newUser', async (req, res) => {
    try {
        const newUser = req.body;
        console.log(newUser);
        const result = await collection.insertOne(newUser);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve index.html
app.get(studentIdPath, (req, res) =>{
    res.sendFile(__dirname.substring(0, __dirname.length - 3) + "index.html");
});

// GET Endpoint
app.get(studentIdPath + '/get', (req, res) => {
    res.send({message: "Hello from the server!"});
});

// POST Endpoint
app.post(studentIdPath, (req, res) => {
    const receivedData = req.body;
    console.log(receivedData);
    res.send({"Data received from the client" : receivedData})
});

// Start the server
app.listen(8080, () => {
    console.log('Server running on port 8080');
    childprocess.exec('start http://localhost:8080/M00886707');
});