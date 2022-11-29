const express = require('express');

const router = express.Router();

//get lab results
router.get('/',(req, res, next)=>{
    res.status(200).json({
        message:'Get lab results using GET'
    });
});

//get lab results of certain patient
router.get('/:patientId',(req, res, next)=>{
    res.status(200).json({
        message:'Get lab results of a certain patient using GET',
        id: req.params.patientId
    });
});

//post lab results
router.post('/',(req, res, next)=>{
    res.status(200).json({
        message:'send lab results using POST'
    });
});

module.exports=router;