const express = require('express');
const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'})
const app = express();
const PORT = process.env.PORT || 3000;
const bootroute = require('./routes/bootcamps')
const courseroute = require('./routes/courses')
const logger = require('./middlewares/logger');
const morgan = require('morgan')
const connectDb = require('./config/db');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error')
const colors = require('colors');



if(process.env.NODE_ENV === 'development'){

    app.use(morgan('dev'))
}

connectDB();
app.use(express.json());
 app.use('/api/v1/bootcamps',bootroute);
 app.use('/api/v1/courses',courseroute);
app.use(errorHandler);
const server = app.listen(PORT, () => {
  
    console.log(`App running in ${process.env.NODE_ENV} at port ${PORT}!`.yellow.bold);
});

process.on('unhandledRejection',(err,promise) =>{
console.log(`error : ${err.message}`);
server.close(() => {
    process.exit(1);
})
})