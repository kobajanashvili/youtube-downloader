const express = require('express');
const fs = require('fs');
const ytdl = require('ytdl-core');
const {promisify} = require('util');
const url = require('url');
const getInfoVideo = promisify(ytdl.getInfo);

const router = express.Router();

router.post('/download', async (req, res) => {
    try {
        // https://www.youtube.com/watch?v=SNLJ4S-ltYM
        const info = await getInfoVideo(req.body.url.replace('http://www.youtube.com/watch?v=', ''));
        console.log(req.body.url);

        ytdl(req.body.url)
            .pipe(fs.createWriteStream(`./videos/${info.title}.mp4`))
            .on('finish', () => {
                res.status(203).download(`./videos/${info.title}.mp4`);
                console.log('done! download');
            })
    } catch (err) {
            res.status(500).json(err);
    }
});

module.exports = router;
