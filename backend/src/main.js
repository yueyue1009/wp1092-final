import mongo from './mongo.js';
import express from 'express';
// import cors from 'cors';
import routes from './routes/index.js';
import * as path from 'path'
// gotta load in MONGO_URL before `mongo.connect()`
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildPath = path.join('./../frontend/build');
// const buildPath = "./../frontend/build"
const app = express();
app.use(express.static(buildPath));
// app.use(cors());
app.use(express.json());
app.use('/', routes);
app.get('*', (req, res) => {
  // res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
  res.sendFile(path.resolve('./../frontend/build/index.html'));
});

mongo.connect();

const server = app.listen(process.env.PORT || 4000, function () {
  console.log('Listening on port ' + server.address().port);
});
