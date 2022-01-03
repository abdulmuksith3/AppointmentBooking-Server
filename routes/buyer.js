const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const dbo = require('../db')


router.get('/findOne/:uid', async (req, res) => {
    // console.log("findOne", req.body)

    const uid = req.params.uid
    const dbConnect = dbo.getDb();
    try {
        const result = await dbConnect.collection('buyers').findOne({_id: ObjectId(uid)})
        console.log("res -", result)
        res.send(result);
    } catch (error) {
        res.status(400).send(`Error fetching User - ${uid}`);
    }

    // console.log("findOne END")
});

router.get('/findAll', async (req, res) => {
    // console.log("findAll", req.body)
    const projection = {fullName: 1, photoURL: 1}
    const dbConnect = dbo.getDb();
    try {
        const result = await dbConnect
        .collection('buyers')
        .find({})
        .project(projection)
        .toArray();

        res.send(result);
    } catch (error) {
        res.status(400).send(`Error fetching all Users`);
    }

    // console.log("search END")
});

router.post('/bookAppointment', async (req, res) => {
    console.log("bookAppointment - START")
    const {buyerId, sellerId, date, time} = req.body;
    const dbConnect = dbo.getDb();
    
    const _id = new ObjectId()
    const document = {
        _id,
        buyerId,
        sellerId,
        date,
        time,
        status: "PENDING"       
    }

    console.log(document)

    try {
        dbConnect
        .collection('buyers')
        .updateOne(
            {_id: ObjectId(buyerId)}, 
            {$push: {appointments : document}}
        )

        dbConnect
        .collection('sellers')
        .updateOne(
            {_id: ObjectId(sellerId)}, 
            {$push: {requests : document}}
        )
        res.send({message:"Success"});
    } catch (error) {
        res.status(400).send(`Error adding`);
    }
    console.log("bookAppointment END")
});

router.post('/cancelAppointment', async (req, res) => {
    console.log("cancelAppointment - START")
    const {buyerId, appointmentId, sellerId, status} = req.body;
    const dbConnect = dbo.getDb();
    
    try {
        dbConnect
        .collection('buyers')
        .updateOne(
            {_id: ObjectId(buyerId), 'appointments._id': ObjectId(appointmentId)}, 
            {$set: {"appointments.$.status" : "CANCELLED"}}
        )
        
        if(status === "PENDING"){
            dbConnect
            .collection('sellers')
            .updateOne(
                {_id: ObjectId(sellerId), 'requests._id': ObjectId(appointmentId)},
                {$pull: {}}
            )

        } else {
            dbConnect
            .collection('sellers')
            .updateOne(
                {_id: ObjectId(sellerId), 'appointments._id': ObjectId(appointmentId)}, 
                {$set: {"appointments.$.status" : "CANCELLED"}}
            )
        }
        
        res.send({message:"Success"});
    } catch (error) {
        res.status(400).send(`Error Cancelling`);
    }


    console.log("cancelAppointment END")
});

module.exports = router;