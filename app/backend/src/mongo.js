import mongoose from 'mongoose';

function connectMongo() {
  mongoose.connect(
    "mongodb+srv://admin:NTU2021wp@cluster0.gl9ld.mongodb.net/WP-Project?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('mongo connected!');
  });
}

const mongo = {
  connect: connectMongo,
};

export default mongo;
