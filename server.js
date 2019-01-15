const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');

app.use(express.static(path.join(__dirname, 'client/build')))


app.get('*', (req, res) => {
  
const uri = "mongodb+srv://dave:onetwo@addressbook-1l4ir.mongodb.net/admin"
MongoClient.connect(uri, { useNewUrlParser: true },function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   var tar = ""
   const collection = client.db("physicianContactInfo").collection("PhysicianInfo").find({}).toArray(function(err,result){

   	if(err) throw err;



   	res.send(result)
   	client.close();

   });


 
  
});


});
app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});







app.listen(port, () => console.log(`Listening on port ${port}`));