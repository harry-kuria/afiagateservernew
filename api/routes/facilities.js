const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

var jwt = require('jsonwebtoken');
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'afiagate',
    password: 'H@rri50n',
    port: 5432
  })

const storage = multer.diskStorage({
    destination: "./facilityimages", /*(req, file,cb) => {
        cb(null, __dirname+'/images/')
    },*/
    filename: (req, file, cb) => {
        console.log(file);
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({storage: storage });


router.post('/login', (req, res, next)=>{

  const sqlcheck = 'SELECT * FROM facilities WHERE facilityname=$1 AND contact=$2';

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

router.post('/signup',upload.single('photoURL'), (req, res, next)=> {


    const sqlCheck = 'SELECT id FROM facilities WHERE contact=$1';
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
    const contact = req.body.contact;
    const facilityaddress = req.body.facilityaddress;
    const photoURL = `http://192.168.2.119:5000/${req.file.path}`;
    const regnumber = req.body.regnumber;

    const sqlInsert = 'INSERT INTO facilities (photourl, facilityname,facilityaddress, contact, verified, regnumber ) VALUES ($1, $2, $3, $4, $5, $6);';
    pool.query(sqlInsert,[ photoURL,username, facilityaddress, contact, "No", regnumber ], (error, results) =>{
        if (error) { 
            throw error
          }
        
          
          res.status(200).json({
            message: "Successful insertion to database",
            photoURL: photoURL,
            username: username,
            facilityaddress: facilityaddress,
            contact: contact,
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

//get facilities
router.get('/',(req, res, next)=>{
    const sqlSelect = "SELECT * FROM facilities"; 
    pool.query(sqlSelect, (error, result)=>{
        res.send(result.rows);
    })
});

//get a facility
router.get('/:facilityId',(req, res, next)=>{
    res.status(200).json({
        message: 'Get a facility using GET',
        id: req.params.facilityId
    });
});

//post facilities
router.post('/',upload.single('photourl'),(req, res, next)=>{
    const photoURL = `http://192.168.2.119:5000/${req.file.path}`;
    const facilityname = req.body.facilityname;
    const facilityaddress = req.body.facilityaddress;
    const contact = req.body.contact;
    
    //const photoURL = `http://localhost:5000/${req.file.path}`;
    
    const sqlInsert = 'INSERT INTO facilities (photourl, facilityname, facilityaddress, contact) VALUES ($1, $2, $3, $4);';
    pool.query(sqlInsert,[ photoURL,facilityname, facilityaddress, contact ], (error, results) =>{
        if (error) { 
            throw error
          }
          
          
          res.status(200).json({
            
            message: "Successful insertion to database",
            
            photoURL: photoURL,
            facilityname: facilityname,
            facilityaddress: facilityaddress,
            contact: contact
      //      photoURL: photoURL
            
        })
       // res.send(results.rows);
    console.log(results.rows);
          
    });
    
});

//delete facilities
router.delete('/:facilityId',(req, res, next)=>{
    res.status(200).json({
        message: 'delete a facility using DELETE',
        id: req.params.facilityId
    });
});
module.exports=router;