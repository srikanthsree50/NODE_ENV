const express = require('express');
const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'})
const app = express();
const PORT = process.env.PORT || 3000;
const bootroute = require('./routes/bootcamps')
const logger = require('./middlewares/logger');
const morgan = require('morgan')
if(process.env.NODE_ENV === 'development'){

    app.use(morgan('dev'))
}
 app.use('/api/v1/bootcamps',bootroute);
app.listen(PORT, () => {
    console.log(`App running in ${process.env.NODE_ENV} at port ${PORT}!`);
});