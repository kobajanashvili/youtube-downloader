const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const ytdl = require('ytdl-core');
const {promisify} = require('util');
const url = require('url');

const getInfoVideo = promisify(ytdl.getInfo);

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'videos')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/ttt', (req, res) => {
    const title = req.query.title;
    res.download(path.join(__dirname, './videos', title));
});

app.post('/download', async (req, res) => {
    try {
        // https://www.youtube.com/watch?v=SNLJ4S-ltYM
        const info = await getInfoVideo(req.body.url.replace('http://www.youtube.com/watch?v=', ''));

        ytdl(req.body.url)
            .pipe(fs.createWriteStream(`videos/${info.title}.mp4`))
            .on('finish', () => res.redirect(url.format({
                pathname:"/ttt",
                    query: {
                       "title": `${info.title}.mp4`
                    }
            })))
            // .on('finish', () => res.download(path.join(__dirname, './videos', `${info.title}.mp4`)));
    } catch (err) {
        res.status(500).json(err);
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))