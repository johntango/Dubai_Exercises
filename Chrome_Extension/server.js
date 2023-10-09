const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require('fs');
const { OpenAIApi, Configuration } = require('openai');
const cors = require('cors');
const os = require('os');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// get the API key from the file
let apiKey = '';
fs.readFile('openai_key.json', 'utf8', function(err, data) {
    apiKey = JSON.parse(data).OPENAI_API_KEY;
    console.log('API key 1: ' + apiKey);
  
});
//const orgKey = "org-TwcGJdld6pQCyszpn9Y4c7AU"

// use this to test the API key
app.get('/test-api', async (req, res) => {
  const data = req.body;
  const text = data.text;
  try {
      let input = text;
      input = '\nHuman: ' + "I'm a human";
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        };
        
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{role: 'user', content: `${input}`}],
        },
        { headers }
      );
  
      const chatGptResponse = response.data.choices[0].message.content;
        // send response back to client in the form of a JSON object
        // containing the response from the GPT-3 chatbot.
       
      console.log('ChatGPT Respnse:'+ JSON.stringify(chatGptResponse));
      res.status(200).json({ message: chatGptResponse });
    } catch (err) {
      console.log('Error: ' + err);
      res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.post('/api', async (req, res) => {
    console.log('POST request received');
    let data = req.body;
    let text = data.text;
    let type = data.type;
    try {
        let input = "";
        if (type == 'positive') {
            input += '\nHuman: Write a positive response to the following email:'+text;
        } else {
        input += '\nHuman: Write a negative response to the following email:'+text;
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          };
          
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: `${input}`}],
          },
          { headers }
        );
    
        const chatGptResponse = response.data.choices[0].message.content;
          // send response back to client in the form of a JSON object
          // containing the response from the GPT-3 chatbot.
         
        console.log('ChatGPT Respnse:'+ JSON.stringify(chatGptResponse));
        res.json({ message: chatGptResponse });
      } catch (err) {
        console.log('Error: ' + err);
        res.status(500).json({ error: 'An error occurred while processing your request' });
        }
});


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))