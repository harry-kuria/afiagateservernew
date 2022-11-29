const express = require('express');
const router = express.Router();

//post newsfeed
router.post('/',(req, res, next)=>{
    res.status(201).json({
        message: 'post a news feed using POST'
    });
});

//delete a newsfeed
router.delete('/',(req, res, next)=>{
    res.status(200).json({
        message: 'delete a news feed using DELETE'
    });
});
module.exports=router;