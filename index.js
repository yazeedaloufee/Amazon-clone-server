const server = require("./src/server");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT;
const options={
    useNewUrlParser:true,
    useUnifiedTopology:true
}
mongoose.connect(process.env.MONOGODB_URI,options).then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ));


server.start(port);
