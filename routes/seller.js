const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const dbo = require('../db')


router.get('/findOne/:uid', async (req, res) => {
    console.log("findOne", req.body)

    const uid = req.params.uid;
    const dbConnect = dbo.getDb();
    try {
        const result = await dbConnect
        .collection('sellers')
        .findOne({_id: ObjectId(uid)})

        res.send(result);
    } catch (error) {
        res.status(400).send(`Error fetching User - ${uid}`);
    }

    console.log("findOne END")
});

router.get('/findAll', async (req, res) => {
    console.log("findAll", req.body)
    const projection = {fullName: 1, company: 1, photoURL: 1}
    const dbConnect = dbo.getDb();
    try {
        const result = await dbConnect
        .collection('sellers')
        .find({})
        .project(projection)
        .toArray();

        res.send(result);
    } catch (error) {
        res.status(400).send(`Error fetching all Users`);
    }

    console.log("search END")
});

router.get('/search', async (req, res) => {
    console.log("search", req.body)

    const searchString = req.body.searchString
    const dbConnect = dbo.getDb();
    try {
        const result = await dbConnect
        .collection('sellers')
        .find({fullName: {$regex : searchString, $options : 'i'}})
        .limit(10)
        .toArray();

        res.send(result);
    } catch (error) {
        res.status(400).send(`Error fetching User - ${uid}`);
    }

    console.log("search END")
});

router.post('/acceptRequest', async (req, res) => {
    console.log("acceptRequest - START")
    const {buyerId, appointmentId, sellerId, date, time} = req.body;
    const dbConnect = dbo.getDb();
    
    const _id = ObjectId(appointmentId);
    const document = {
        _id,
        buyerId,
        sellerId,
        date,
        time,
        status: "ACCEPTED"       
    }

    try {
        dbConnect
        .collection('buyers')
        .updateOne(
            {_id: ObjectId(buyerId), 'appointments._id': ObjectId(appointmentId)}, 
            {$set: {"appointments.$.status" : "ACCEPTED"}}
        )

        dbConnect
        .collection('sellers')
        .updateOne(
            {_id: ObjectId(sellerId), 'requests._id': ObjectId(appointmentId)},
            {$set: {"requests.$.status" : "ACCEPTED"}}
        )
        
        dbConnect
        .collection('sellers')
        .updateOne(
            {_id: ObjectId(sellerId)},
            {$push: {appointments : document}}
        )

        res.send({message:"Success"});
    } catch (error) {
        res.status(400).send(`Error Accepting`);
    }
    console.log("acceptRequest END")
});


router.post('/rejectRequest', async (req, res) => {
    console.log("rejectRequest - START")
    const {buyerId, appointmentId, sellerId, date, time} = req.body;
    const dbConnect = dbo.getDb();
    
    try {
        dbConnect
        .collection('buyers')
        .updateOne(
            {_id: ObjectId(buyerId), 'appointments._id': ObjectId(appointmentId)}, 
            {$set: {"appointments.$.status" : "REJECTED"}}
        )

        dbConnect
        .collection('sellers')
        .updateOne(
            {_id: ObjectId(sellerId), 'requests._id': ObjectId(appointmentId)},
            {$set: {"requests.$.status" : "REJECTED"}}
        )


        res.send({message:"Success"});
    } catch (error) {
        res.status(400).send(`Error Accepting`);
    }
    console.log("rejectRequest END")
});

router.post('/updateAvailability', async (req, res) => {
    console.log("updateAvailability - START")
    const {_id, timings} = req.body;
    const dbConnect = dbo.getDb();

    console.log(_id,"---",timings)

    // try {        
    //     dbConnect
    //     .collection('sellers')
    //     .updateOne(
    //         {_id: ObjectId(_id)}, 
    //         {$set: {availability : timings}}
    //     )

    //     res.send({message:"Success"});
    // } catch (error) {
    //     res.status(400).send(`Error updateAvailability`, error);
    // }
    console.log("updateAvailability END")
});

module.exports = router;