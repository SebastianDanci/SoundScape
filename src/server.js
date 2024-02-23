import express from 'express';
import cors from 'cors';
import childprocess from 'child_process';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const app = express();
const studentIdPath = '/M00886707';

const username = "SebastianD";
const password = "nfmOGw5BxTtTX4Ke";  // Please ensure to secure your password properly
const server = "coursework.zpidlav.mongodb.net";

const encodedUsername = encodeURIComponent(username);
const encodedPassword = encodeURIComponent(password);

const connectionURI = `mongodb+srv://${encodedUsername}:${encodedPassword}@${server}/?retryWrites=true&w=majority`;

const client = new MongoClient(connectionURI, {
    serverAPI: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});

let db;

client.connect(err => {
    if(err) {
        console.error("Failed to connect to MongoDB", err);
    } else {
        db = client.db("SoundScape");
        console.log("Connected to MongoDB");
    }
});

app.use(cors()); // Enable CORS for all routes
app.use(express.static("./"));
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve index.html
app.get(studentIdPath, (req, res) =>{
    res.sendFile(__dirname.substring(0, __dirname.length - 3) + "index.html");
});

// GET Endpoint for testing connection
app.get(studentIdPath + '/get', (req, res) => {
    res.send({ message: "Hello from the server!" });
});

// POST Endpoint for receiving data from client
app.post(studentIdPath, (req, res) => {
    const receivedData = req.body;
    console.log(receivedData);
    res.send({ "Data received from the client": receivedData });
});

// Endpoint to store profile data
app.post(studentIdPath + '/storeProfile', async (req, res) => {
    if (!db) {
        return res.status(500).json({ error: "Database not initialized" });
    }

    try {
        const profileData = req.body;
        const result = await db.collection('profiles').insertOne(profileData);
        res.status(201).json({ message: 'Profile stored', data: result.ops[0] });
    } catch (err) {
        console.error(err); // Log the error to the console for debugging
        res.status(500).json({ error: err.message }); // Send the specific error message back to the client
    }
});


// Endpoint to retrieve profile data
app.get(studentIdPath + '/getProfile', async (req, res) => {
    try {
        const query = { studentId: "M00886707" };
        const profile = await db.collection('profiles').findOne(query);
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ message: "Profile not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "An error has occurred" });
    }
});

// Start the server
app.listen(8080, () => {
    console.log('Server running on port 8080');
    childprocess.exec('start http://localhost:8080/M00886707');
});
