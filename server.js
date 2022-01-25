const path = require('path');
const express = require('express');
const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'})
const app = express();
const PORT = process.env.PORT || 3000;

const bootroute = require('./routes/bootcamps')
const courseroute = require('./routes/courses')
const adminroute = require('./routes/admin')
const reviewroute = require('./routes/reviews')

const mongoSanitize = require('express-mongo-sanitize');


const logger = require('./middlewares/logger');
const fileupload = require('express-fileupload');
const morgan = require('morgan')
const connectDb = require('./config/db');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error')
const colors = require('colors');
const auth = require('./routes/auth')
const cookieParser = require('cookie-parser');

if(process.env.NODE_ENV === 'development'){

    app.use(morgan('dev'))
}

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(fileupload());
app.use(express.static(path.join(__dirname,'public')));

app.use(mongoSanitize());

 app.use('/api/v1/bootcamps',bootroute);
 app.use('/api/v1/courses',courseroute);
 app.use('/api/v1/auth',auth);
 app.use('/api/v1/admin',adminroute)
app.use('/api/v1/reviews', reviewroute);

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