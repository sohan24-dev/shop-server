
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4'])

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();
const app = express()
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;


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
        const database = client.db("sohanshop");
        const collectiondb = database.collection("products")


        app.get('/data', async (req, res) => {
            const cursor = await collectiondb.find()
            const data = await cursor.toArray()
            res.send(data)
        })

        app.post('/data', async (req, res) => {
            const newdata = req.body;
            // console.log(newdata, 'new data ');
            const data = await collectiondb.insertOne(newdata)
            res.send(data)
        })

        app.get('/data/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const data = await collectiondb.findOne(query)
            res.send(data)
        })

        app.delete('/data/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const data = await collectiondb.deleteOne(query)
            res.send(data)
        })
        app.patch('/data/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedData = req.body;
            console.log(updatedData, "updatedData");
            const data = await collectiondb.updateOne(
                query,
                {
                    $set: updatedData
                }

            )
            res.send(data)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
