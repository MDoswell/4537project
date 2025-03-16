require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

const API_URL = process.env.TRANSCRIPTION_API_URL;
const API_KEY = process.env.API_KEY;

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
        const response = await axios.post(API_URL, body, {headers: headers});

        fs.unlinkSync(audioFilePath);

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
