import mongo from './mongo.js';
import express from 'express';
// import cors from 'cors';
import routes from './routes/index.js';

// gotta load in MONGO_URL before `mongo.connect()`


const buildPath = "./../frontend/build"
// path.join(__dirname, '..', 'build');

const app = express();
app.use(express.static(buildPath));
// app.use(cors());
app.use(express.json());
app.use('/', routes);

mongo.connect();

const server = app.listen(process.env.PORT || 4000, function () {
  console.log('Listening on port ' + server.address().port);
});
