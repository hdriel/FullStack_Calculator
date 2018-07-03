const express = require('express'); // for the nodejs server side
const morgan = require('morgan'); // for the query and body
const bodyParser = require('body-parser') // for parsing json
const helmet = require('helmet'); // make the request more secure

const app = express();
var cors=require('cors');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(helmet())
app.use(cors({origin:true,credentials: true}));

// Routes
const calculator = require('./routes/calculator');
app.use('/calculator',calculator);

// Catch 404 Errors and forward them to error handler
app.use((req,res,next)=>{
    const err = new Error('Page Not Found');
    err.status = 404
    next(err)
});

// Start the server
const port = process.env.PORT || 3013;
app.listen(port,()=>{
    console.log(`Server is listening on http://localhost/${port}`)}
)
