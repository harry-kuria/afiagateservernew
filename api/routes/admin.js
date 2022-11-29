const express = require('express');
const router = express.Router();

//get all admins
router.get('/',(req, res, next)=>{
    res.status(200).json({
        message: 'Get admins using GET'
    });
});

//get a certain admin
router.get('/:adminId',(req, res, next)=>{
    res.status(200).json({
        message: 'Get a certain admin using GET',
        id: req.params.adminId
    });
});

//post admin
router.post('/',(req, res, next)=>{
    res.status(201).json({
        message: 'post admin using POST'
    });
});

//delete facilities
router.delete('/:adminId',(req, res, next)=>{
    res.status(200).json({
        message: 'delete a certain admin using DELETE',
        id: req.params.adminId
    });
});
module.exports=router;