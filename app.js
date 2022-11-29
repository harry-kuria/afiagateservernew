const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require("fs");
const url = require("url");




const userRoutes = require('./api/routes/users');
const patientRoutes = require('./api/routes/patient');
const doctorRoutes = require('./api/routes/doctor');
const labresultsRoutes = require('./api/routes/lab_results');
const newsfeedRoutes = require('./api/routes/newsfeed');
const facilitiesRoutes = require('./api/routes/facilities');
const adminRoutes = require('./api/routes/admin');
const nurseRoutes = require('./api/routes/nurse');

app.use(morgan('dev'));
app.use('/doctorimages',express.static('doctorimages'));
app.use('/nurseimages',express.static('nurseimages'));
app.use('/facilityimages',express.static('facilityimages'));

<<<<<<< HEAD
app.use(bodyParser.urlencoded({extended: false}));
=======
app.use(bodyParser.urlencoded({extended: true}));
>>>>>>> 1cbbf67 (make it better)
app.use(bodyParser.json());
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin','X-Requested-With','Content-Type','Accept','Authorization');
    if (req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next(); 
});

//setting up a middle ware for every request
app.use('/users',userRoutes);
app.use('/patient',patientRoutes);
app.use('/doctor',doctorRoutes);
app.use('/labresults',labresultsRoutes);
app.use('/newsfeed',newsfeedRoutes);
app.use('/facilities',facilitiesRoutes);
app.use('/admin',adminRoutes);
app.use('/nurse',nurseRoutes);


//handling errors
app.use((req, res, next)=> {
    const error = new Error('Not Found');
    error.status=404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});
module.exports = app;