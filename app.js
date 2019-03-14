const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const downloadRoutes = require('./routes/download');
const mainRoutes     = require('./routes/main');

// const getInfoVideo = promisify(ytdl.getInfo);

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'videos')));

app.use('/api', downloadRoutes);
app.use(mainRoutes);



app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))