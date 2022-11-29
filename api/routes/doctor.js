const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const multer = require('multer');
const path = require('path');

var jwt = require('jsonwebtoken');

const randomId = require('random-id');

const Pool = require('pg').Pool
const pool = new Pool({


  user: 'postgres',
    host: 'localhost',
    database: 'afiagate',
    password: 'H@rri50n',
    port: 5432
//   user: 'hakisolu_hakisolutions',//'postgres',//process.env.PGSQL_MYUSER,
//   host: 'localhost',//process.env.PGSQL_HOST,
//   database: 'hakisolu_afiagate',//'afiagate',//process.env.PGSQL_DATABASE,
//   password: 'hakisolu_afiagate',//process.env.PGSQL_PASSWORD,
//   port: 5432
// user: process.env.PGSQL_USER,
//   host: process.env.PGSQL_HOST,
//   database: process.env.PGSQL_DATABASE,
//   password: process.env.PGSQL_PASSWORD,
//   port: 5432

  // user: 'postgres',//process.env.PGSQL_MYUSER,
  // host: process.env.PGSQL_HOST,
  // database: 'afiagate',//process.env.PGSQL_DATABASE,
  // password: process.env.PGSQL_PASSWORD,
  // port: 5432

  })


  const storage = multer.diskStorage({
    destination: "./doctorimages", /*(req, file,cb) => {
        cb(null, __dirname+'/images/')
    },*/
    filename: (req, file, cb) => {
        console.log(file);
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({storage: storage });

const seconds = new Date().getTime() / 1000;

var len = 30;
 
// pattern to determin how the id will be generated
// default is aA0 it has a chance for lowercased capitals and numbers
var pattern = 'aA0'
 
var customid = randomId(len, pattern)




router.post('/login', (req, res, next)=>{

  const sqlcheck = 'SELECT * FROM doctors WHERE username=$1 AND contact=$2';

  pool.query(sqlcheck,[req.body.username, req.body.contact], (err,results) =>{
    
    if (err) {
      console.log(err);
      res.status(500).send('There was an error logging in the user');
    }
    else {
      // If the user exists, compare the hashed password from the database with the password from the request
      var user = results.rows[0];
      if (user){
        // If the passwords match, create a JWT
        var token = jwt.sign({ user: user }, "YesuNiWanguNiWaUzimaWaMileleNaAnafanyaMamboAmbayoMwanadamuHaweziKufanya", {
          expiresIn: 86400 // expires in 24 hours
        });
 
        // Return the JWT to the user
        res.status(200).send({ auth: true,  token: token });
      }
      else {
         // If the user doesn't exist, return an error
         res.status(404).send(req.body.username);
         //res.send(req.body.username);
         console.log(req.body.username)
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



//add doctor to database
router.post('/signup',upload.single('photoURL'), (req, res, next)=> {



    const sqlCheck = 'SELECT id FROM doctors WHERE contact=$1';
    pool.query(sqlCheck,[req.body.contact], (err, results)=> {

  if(results.rows[0]){

    return res.status(500).json({
      message: "This contact is already registered"
    })
  }

  else{

    bcrypt.hash(req.body.password,10,(err, hash) => {

  
        if (err){
      
          return res.status(500).json({
            error: err
          });
        }
      
        else {

            const username = req.body.username;
    const password = req.body.password;
    const contact = req.body.contact;
    const speciality = req.body.speciality;
    const photoURL = `http://192.168.2.119:5000/${req.file.path}`;
    const regnumber = req.body.regnumber;


    //const sqlInsert = 'INSERT INTO doctors (username, password, contact, speciality, photourl,booking,time,charges,patient_username,patient_contact, verified, regnumber) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);';
    const sqlInsert = 'INSERT INTO doctors (username, password, contact, speciality, photourl, verified, regnumber) VALUES ($1, $2, $3, $4, $5, $6, $7);';
    pool.query(sqlInsert,[ username,password, contact, speciality, photoURL, "No", regnumber ], (error, results) =>{
        if (error) { 
            throw error
          }
        
          
          res.status(200).json({
            message: "Successful insertion to database",
            
            username: username,
            password: password,
            contact: contact,
            speciality: speciality,
            photoURL: photoURL,
            regnumber: regnumber
            
          })
            
            
        });
       // res.send(results.rows);
    console.log(results.rows);
        
}
});
}

})


//const {username, password, contact, speciality} = req.body;


});

//get all doctors
router.get('/',(req, res, next)=> {

    const sqlSelect = "SELECT * FROM doctors"; 
    pool.query(sqlSelect, (error, result)=>{
        res.send(result.rows);
    })
    
});

//get a doctor by ID
router.get('/:doctorId',(req, res, next)=> {
    res.status(200).json({
        message: 'Get a doctor by id using GET ',
        id: req.params.doctorId
    });
});


//edit booking details
router.put('/doctors',(req,res, next)=> {
  const time = req.body.time;
  const charges = req.body.charges;
  const booking = req.body.booking;
  const sql = 'UPDATE doctors SET time=?, charges=?, booking=? WHERE booking = ?';
  pool.query(sql,[time,charges,booking], (error, result)=>{
    res.send(result.rows);
})
});

//input booking
router.patch('/doctor',(req,res, next)=> {
  const patient_username = req.body.patient_username;
  const patient_contact = req.body.patient_contact;
  const username = req.body.username;
  const contact = req.body.contact;
  const sql = 'update doctors set patient_username=$1 where username=$2 and contact=$3;';
  //const sql = 'update doctors set patient_username=$1, patient_contact=$2 where username=$3 and contact=$4;';
  pool.query(sql,[patient_username,"Dr. Harry Potter ","+254712311209"], (error, result)=>{

    if (error) {
      throw error
    }
    res.status(200).send(result.rows);
    console.log(username);
})

});

//edit doctor details
router.patch('/:doctorId',(req, res, next)=>{
    res.status(200).json({
        message: 'Edit a doctors details using PATCH',
        id: req.params.doctorId
    });
});
//delete doctor
router.delete('/:doctorId',(req, res, next)=>{
    res.status(200).json({
        message: 'doctor deleted using DELETE',
        id: req.params.doctorId
    });
});
 
module.exports=router;



/////////////////////////////////////////TEST////////////////////////////////////////////////////////
// const express = require('express');
// const bcrypt = require('bcrypt');
// const multer = require('multer');
// const router = express.Router();
// const Pool = require('pg').Pool
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'afiagate',
//     password: 'H@rri50n',
//     port: 5432
//   })

//     const storage = multer.diskStorage({
//     destination: "./doctorimages", /*(req, file,cb) => {
//         cb(null, __dirname+'/images/')
//     },*/
//     filename: (req, file, cb) => {
//         console.log(file);
//         return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//     }
// })

// const upload = multer({storage: storage });

// const seconds = new Date().getTime() / 1000;

// var len = 30;
 
// // pattern to determin how the id will be generated
// // default is aA0 it has a chance for lowercased capitals and numbers



// router.post('/', upload.single('photoURL'), (req, res, next)=>{

// // const  data  = pool.query(`SELECT * FROM users WHERE contact= $1;`, [req.body.contact]); //Checking if user already exists
// // const  arr  =  data.rows;  
// // if (arr.length  !=  0) {
// // return  res.status(400).json({
// // error: "This contact is already registered.",
// // });
// // } 
// // else 
// {bcrypt.hash(req.body.password,10,(err, hash) => {
//   if (err){

//     return res.status(500).json({
//       error: err
//     });
//   }

//   else {
//     const username = req.body.username;
//     const password = hash;
//     const contact = req.body.contact;
//     const speciality = req.body.speciality; 
//     const photoURL = `http://localhost:5000/${req.file.path}`;
//     const sqlInsert = 'INSERT INTO doctors (username, password, contact, speciality,photourl) VALUES ($1, $2, $3, $4, $5);';
//     pool.query( sqlInsert,[username, password, contact, speciality,photoURL], (error, results) =>{ 
//         if (error) {
//             throw error
//           }
//           res.send(results.rows);
//           console.log(results.rows);      
//     });
//     console.log(password);

//   }
// });
// }
   
  
//     //const {username, password, contact, speciality} = req.body;
  
// });

// router.get('/',(req, res, next)=>{ 
//   const sqlInsert = "SELECT * FROM doctors;"
//   pool.query(sqlInsert, (error, results) =>{
//     if (error) {
//         throw error
//       }
//     res.send(results.rows);
//     console.log(results.rows);
      
      
// });
// })

// module.exports = router;