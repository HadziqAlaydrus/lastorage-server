const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/form"); 
const bodyParser = require('body-parser');
const { application } = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', userRoutes);

app.get('/', (req,res)=>{
    res.send("Welcome to LaStorage API")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`); 
});
