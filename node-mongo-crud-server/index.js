const express=require('express')
const cors=require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port = process.env.PORT || 5000;

//middlewire
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://admin:asifalif@cluster0.skhdz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const userCollection=client.db('nodeMongoCrud').collection('users');

        app.get('/users',async (req,res)=>{
            const query={};
            const cursor=userCollection.find({})
            const users=await cursor.toArray();
            res.send(users)
        })

        app.get('/users/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await userCollection.findOne(query)
            res.send(result);
        })

        app.post('/users',async(req,res)=>{
            const user=req.body;
            const result= await userCollection.insertOne(user)
            res.send(result)
        })

        app.put('/users/:id',async(req,res)=>{
            const id=req.params.id;
            const user=req.body;
            const filter={_id:ObjectId(id)}
            const option={upsert:true}
            const updateUser={
                $set:{
                    name:user.name,
                    address:user.address,
                    email:user.email
                }
            }
            const updatedResult= await userCollection.updateOne(filter,updateUser,option)
            res.send(updatedResult);
            console.log(id, user);
        })
        
        app.delete('/users/:id',async (req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await userCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        })

    }
    finally{

    }
}
run().catch(err=>console.log(err))



app.get('/',(req,res)=>{
    res.send('Hello Server is Ready')
})

app.listen(port,()=>{
    console.log(`Port is Running ${port}`);
})