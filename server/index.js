import exp from "express"
import mon from "mongoose";
import cors from "cors"
import dot from "dotenv"
import nodemon from "nodemon";


const app = exp()
dot.config();
app.use(exp.json())
app.use(cors())

const tschema = new mon.Schema({
    title : {
        type:String
    },
    description: String
});
const todoCollection = mon.model('todos',tschema);

//Get
app.get('/todo',async (req,res)=> {
    try{
        const data = await todoCollection.find({}).exec();
        console.log("Getting Data Successfully");
        res.status(200).json(data);
    }catch(err){
        console.log("Failed to get Data");
        res.status(400).json(err);
    }
});


app.post('/todo', async (req, res) => {
    try{
    const data = {title: req.body.title, description: req.body.description};
    const entry = new todoCollection(data);
        await entry.save();
        console.log("Data Inserted Successfully");
        res.status(200).json(data);
    }catch(err){
        console.log("Failed to Insert Data:",err);
        res.status(400).json(err);
    }
});



//put
app.put('/todo/:id', async (req,res) => {
    try{
        const data = await todoCollection.findByIdAndUpdate(req.params.id, req.body, {new: true});
        console.log('Data updated Successfully');
        res.status(200).json(data);
    }
    catch(err){
        console.log("Failed to update Data");
        res.status(400).json(err);
    }
});

//delete
app.delete('/todo/:id',async (req,res) =>{
    try{
        await todoCollection.findByIdAndDelete(req.params.id);
        console.log('Data deleted Successfully');
        res.status(200).json({message: `Deleted ${req.params.id} succesfully`});
    }
    catch(err){
        console.log("Failed to delete Data");
        res.status(400).json(err);
    }
    });
    
const connect = async () => {
    try {
        await mon.connect(process.env.MONGO);
         console.log("Connection to DB successfully");
    }
    catch(err){
        console.log("Error while connecting to DB;",err);

    };
}

app.listen(process.env.PORT, () => {
    connect();
    console.log("server is running....");
})
