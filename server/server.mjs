import express from 'express';
import bodyParser  from 'body-parser';
import OpenAI from 'openai'; // Import OpenAI modules


import {MongoClient,ServerApiVersion} from 'mongodb';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const password = "Navya#1427";
const enpassword = encodeURIComponent("Navya#1427");
const uri = `mongodb+srv://trickerbaby:${enpassword}@cluster0.rq5ucba.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



const openai = new OpenAI({apiKey: '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'});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome!' });
});


app.get('/getquestion',async (req,res)=>{
  const feed = req.query.feed;
  const username = req.query.username;
  const day = req.query.day;
 

  try{
    await client.connect();
    const db = client.db('ByteCoach');
    const col = db.collection('Users');
    var roadmap = await col.findOne({username});
  
  }
  catch(err)
  {
    console.log(err);
  }
 
  console.log("todays topic is "+roadmap.roadmap[parseInt(day)]);

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Give 1 'C programming' question on the base of this topic ${roadmap.roadmap[parseInt(day)]} make a question that makes me improve on my mistakes and these are some of my past feedbacks ${feed}`,
      },
    ],
  });

  console.log("AI request processed");

  var question = completion.choices[0].message.content;

  console.log(question);
  res.json({question});



})


app.get('/personalroadmap', async (req, res) => {
  const sub = req.query.subject;
  const age = req.query.age;
  const exp = req.query.exp;
  const aim = req.query.aim;
  const hours = req.query.hours;
  const username = req.query.username;


  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Make a roadmap for ${sub} considering the following constraints :- 1) My age is ${age} 2) I have ${exp} coding experience in past 3) I can spare only ${hours} hour per day for learning 4) My goal is to ${aim} 6) Your reply should contain only the day wise roadmap every day saperated by '#' symbol and only one liner like : "#Day1 : Learn about history of C programming"`,
      },
    ],
  });

  console.log("AI request processed");

  var roadmap = completion.choices[0].message.content.split('#');

  console.log(roadmap);
  
  

  try{
    await client.connect();
    const db = client.db('ByteCoach');
    const usersCollection = db.collection('Users');
    await usersCollection.insertOne({username , roadmap});
  }
  catch(err)
  {
    console.log("Error uploading to DB",err);
  }

  res.json({ roadmap: roadmap });
});

app.get('/teachme',async (req,res) => {
  const username = req.query.username;
  const day = req.query.day;
  
  try
  {
    await client.connect();
    const db = client.db('ByteCoach');
    const col = db.collection('Users');

    var roadmap = await col.findOne({username});
    console.log(roadmap.roadmap[parseInt(day)]);
  }
  catch(err)
  {
    console.log(err);
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Teach me this topic in a friendly manner -> ${roadmap.roadmap[parseInt(day)]}`,
      },
    ],
  });
  console.log(completion.choices[0].message.content);
  res.json({theory:completion.choices[0].message.content });

});

app.get('/practice', (req, res) => {
  const Tempfeedback = req.query.Tempfeedback;
  console.log(Tempfeedback);
  res.json({ Tempfeedback });
});

app.listen(3002, () => {
  console.log('server started');
});
