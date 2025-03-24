require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

app.use(cors())
app.use(express.json())

app.post('/transcribe', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const audioFilePath = req.file.path;
        const file = fs.createReadStream(audioFilePath)
        const headers = {
            'api-key': API_KEY,
            'Content-Type': 'multipart/form-data'
        }
        const body = {
            file: file
        }
        const response = await axios.post(API_URL + 'transcribe', body, {headers: headers});

        fs.unlinkSync(audioFilePath);

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
});

app.post('/gradeanswer', async (req, res) => {
    try {
        const headers = {
            'api-key': API_KEY,
            'Content-Type': 'application/json'
        }
        const body = {
            text: req.body.text
        }
        console.log(API_URL);
        const response = await axios.post(API_URL + 'gradeanswer', body, {headers: headers});

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to grade answer' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
