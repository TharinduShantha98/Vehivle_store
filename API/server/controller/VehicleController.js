const express = require('express');
const router = express.Router();
const multer = require('multer');


let VehicleModel = require('../model/VehicleModel');


//store
const Storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload/images/');
    },

    filename:(req,file, cb)=>{
        console.log(file.originalname);
        console.log(Date.now());
        cb(null, "Vehicle" + file.originalname);

    }
});


const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage:Storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter

})



router.post('/',upload.single('image'), (req,res,next)=>{

    const newVehicleModel = new VehicleModel({
                vehicleNumber: req.body.vehicleNumber,
                vehicleType: req.body.vehicleType,
                venue: req.body.venue,
                price: req.body.price,
                mileage: req.body.mileage,
                image:req.file.originalname,

    });

    newVehicleModel
        .save()
        .then(result =>{
            console.log(result);
            res.status(200).json({
                    message: "vehicle successfully",
            })

        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        })


})



router.get('/',(req,res,next)=>{
    VehicleModel.find()
        .select("vehicleNumber vehicleType venue price  mileage image _id")
        .exec()
        .then(docs =>{
            const  response ={
                count: docs.length,
                vehicles: docs.map(doc =>{
                    return {
                        vehicleNumber: doc.vehicleNumber,
                        vehicleType:doc.vehicleType,
                        venue: doc.venue,
                        price: doc.price,
                        mileage: doc.mileage,
                        image: doc.image,
                        request:{
                            type:"GET",
                            url:"http://localhost:3000/upload/images/Vehicle"+doc.image
                        }



                    }
                })


            }


            res.status(200).json(response);


        })

        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        })




})


module.exports = router
