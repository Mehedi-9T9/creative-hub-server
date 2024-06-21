const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
//middleware
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("server is running")
})
//mongodb code start


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cd4uzfy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const usersCollection = client.db("creative-hub").collection("users");

        app.post("/rejisterUser", async (req, res) => {
            const userInfo = req.body
            // const email = userInfo.email
            const filter = { email: userInfo?.email }
            const search = await usersCollection.findOne(filter)

            if (!search) {
                const result = await usersCollection.insertOne(userInfo)
                return res.send(result)
            }
            res.send({ message: "Authentication Fail" })

        })

        //Login users
        app.post("/loginData", async (req, res) => {
            const userInfo = req.body
            const filter = { email: userInfo.email, password: userInfo.password }
            const search = await usersCollection.findOne(filter)
            if (search) {
                return res.send({ message: true })
            } else { return res.send({ message: false }) }
        })

        app.get('/usersData', async (req, res) => {
            const email = req.query.email
            const filter = { email: email }
            const result = await usersCollection.findOne(filter)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);

//mongodb code end
app.listen(port, () => {
    console.log(`the server runnning port on: ${port}`);
})