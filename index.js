const express = require('express');
const mongoose = require('mongoose');
const app = express();
const config = require('./config');
const notesRoutes = require('./routes/notesRoutes')



//connection to DB 
mongoose.connect(config.mongodbURI)
.then(()=>{
    console.log('mongodb connected!')
})
.catch((err) =>{
    console.error(err,'connection in db error')
})



app.use(express.json());

//routes
app.use('/api', notesRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})

module.exports = app;
