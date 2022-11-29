const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const router = express.Router();
const Sequelize = require('sequelize');

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'afiagate',
    password: 'H@rri50n',
    port: 5432
  })

 
  
  const {User} = require("../models/user");

router.post('/login', (req, res, next)=>{

  const sqlcheck = 'SELECT * FROM users WHERE username=$1 AND contact=$2';

  pool.query(sqlcheck,[req.body.username, req.body.contact], (err,results) =>{
    
    if (err) {
      console.log(err);
      res.status(500).send('There was an error logging in the user');
    }
    else {
      // If the user exists, compare the hashed password from the database with the password from the request
<<<<<<< HEAD
      var user = results.rows[0];
      if (user){
        // If the passwords match, create a JWT
        var token = jwt.sign({ user: user }, "YesuNiWanguNiWaUzimaWaMileleNaAnafanyaMamboAmbayoMwanadamuHaweziKufanya", {
=======
      var user = results[0];
      if (user){
        // If the passwords match, create a JWT
        var token = jwt.sign({ user: user }, process.env.SECRET, {
>>>>>>> 1cbbf67 (make it better)
          expiresIn: 86400 // expires in 24 hours
        });
 
        // Return the JWT to the user
        res.status(200).send({ auth: true,  token: token });
      }
      else {
         // If the user doesn't exist, return an error
<<<<<<< HEAD
         res.status(404).send(req.body.username);
         //res.send(req.body.username);
         console.log(req.body.username)
=======
         res.status(404).send('User not found');
>>>>>>> 1cbbf67 (make it better)
      }
    }
    // if (results.rows[0]){
    //   return res.status(500).json({
    //     message: "Invalid credentials"
    //   })
      
    // }
    // else {
    //   return res.status(200).json({
    //     message: "Successful Login",
    //     error: err
    //   })
    //   console.log(req.body.username);
    // }
  })
});



router.post('/signup', (req, res, next)=>{

  
// const  data  = pool.query(`SELECT * FROM users WHERE contact= $1;`, [req.body.contact]); //Checking if user already exists
// const  arr  =  data.rows;  
// if (arr.length  !=  0) {
// return  res.status(400).json({
// error: "This contact is already registered.",
// });
// } 
// else

const sqlCheck = 'SELECT id FROM users WHERE contact=$1';
pool.query(sqlCheck,[req.body.contact], (err, results)=> {

  if(results.rows[0]){

    return res.status(500).json({
      message: "This contact is already registered"
    })
  }

  else {
    
    bcrypt.hash(req.body.password,10,(err, hash) => {

  
      if (err){
    
        return res.status(500).json({
          error: err
        });
      }
    
      else {
    
        
        const username = req.body.username;
        const password = hash;
        const contact = req.body.contact;
        const speciality = req.body.speciality; 
        const sqlInsert = 'INSERT INTO users (username, password, contact, speciality) VALUES ($1, $2, $3, $4);';
        pool.query( sqlInsert,[username, password, contact, speciality], (error, results) =>{ 
            if (error) {
                throw error
              }
              res.send(results.rows);
              console.log(results.rows);      
        });
        console.log(password);
    
      }
    });
  }

})
  

   //const {username, password, contact, speciality} = req.body;
  
  
});




   
  
   


router.get('/',(req, res, next)=>{ 
  const sqlInsert = "SELECT * FROM users;"
  pool.query(sqlInsert, (error, results) =>{
    if (error) {
        throw error
      }
    res.send(results.rows);
    console.log(results.rows);
      
      
});
})

module.exports = router;