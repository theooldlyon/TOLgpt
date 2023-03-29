import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const configuration = new Configuration({
    organization: "org-18xF7PVjwhACpXni0MSFYuWy",
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: "TzftNALjl0vNnegEEl7qT3BlbkFJ7W1xim4aYEbLH1YpxCPp"
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Aggiungi il middleware per servire i file statici con i tipi MIME corretti
app.use(
    express.static(join(__dirname, '..', 'client'), {
        setHeaders: (res, path) => {
            if (path.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript');
            } else if (path.endsWith('.svg')) {
                res.setHeader('Content-Type', 'image/svg+xml');
            } else if (path.endsWith('.css')) {
                res.setHeader('Content-Type', 'text/css');
            }
        }
    }

    ));

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        if (prompt === '') res.status(200).send('Please, write a valid request');

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [ { role: "user", content: `${prompt}` } ],
        });

        console.log(completion.data.choices[ 0 ].message.content);

        res.status(200).send({
            bot: completion.data.choices[ 0 ].message.content
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error || 'Something went wrong');
    }
});

app.get('/', (req, res) => {
    const homeFilePath = join(__dirname, '..', 'client', 'pages', 'index.html');
    res.sendFile(homeFilePath);
});

// const response = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     prompt: `${prompt}`,
//     temperature: 1, // Higher values means the model will take more risks.
//     max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
//     top_p: 1, // alternative to sampling with temperature, called nucleus sampling
//     frequency_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
//     presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.

//     model: "gpt-3.5-turbo",
//     messages: [ { role: "user", content: `${prompt}` } ],
// });

app.get('/chatbot', (req, res) => {
    const chatbotFilePath = join(__dirname, '..', 'client', 'pages', 'chatbot.html');
    res.sendFile(chatbotFilePath);
});
app.get('/tolgpt', (req, res) => {
    const chatbotFilePath = join(__dirname, '..', 'client', 'pages', 'tolgpt.html');
    res.sendFile(chatbotFilePath);
});

// ...

// ...


// ...




app.post('/image', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        if (prompt === '') res.status(200).send('Please, write a valid request');

        const buffer = prompt;
        // Set a `name` that ends with .png so that the API knows it's a PNG image
        buffer.name = "image.png";
        const response = await openai.createImageVariation(
            buffer,
            1,
            "1024x1024"
        );
        console.log(response.data.data[ 0 ].url);


    } catch (error) {
        console.error(error);
        res.status(500).send(error || 'Something went wrong');
    }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));