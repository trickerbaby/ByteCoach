import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai'; // Import OpenAI modules

const app = express();

app.use(express.json());
app.use(bodyParser.json());


const openai = new OpenAI({apiKey: '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'});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome!' });
});

app.get('/personalroadmap', async (req, res) => {
  const sub = req.query.subject;
  const age = req.query.age;
  const exp = req.query.exp;
  const aim = req.query.aim;
  const hours = req.query.hours;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Make a roadmap for ${sub} considering the following constraints :- 1) My age is ${age} 2) I have ${exp} coding experience in past 3) I can spare only ${hours} hour per day for learning 4) My goal is to ${aim} 6) Your reply should contain only the day wise roadmap every day saperated by '#' symbol and only one liner like : "#Day1 : Learn about history of C programming"`,
      },
    ],
  });

  
  console.log(completion.choices[0].message);
  res.json({ roadmap: completion.choices[0].message });
});

app.get('/practice', (req, res) => {
  const Tempfeedback = req.query.Tempfeedback;
  console.log(Tempfeedback);
  res.json({ Tempfeedback });
});

app.listen(3002, () => {
  console.log('server started');
});
