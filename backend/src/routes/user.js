const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParser = require('../utils/pdf-parser');
const scheduleController = require('../models/schedule');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(nul, 'uploads/');
    }, 
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage});


router.post('user/upload', upload.single('pdfFile'), async (req, res) => {

    try{
        const filename = req.file.filename;
    const path = req.file.path;

    const scheduleData = await pdfParser(path);
    await Schedule.saveSchedule(scheduleData, req.userId);



    res.json({success: true, filename, path});
    } catch (error) {
        console.log('Error uploading file and getting schedule:', error);
        res.status(500).json({ success: false, error: 'Error uploading file and getting schedule'});
    }

});

router.post('/create-schedule', scheduleController.createScheduleEntry);


router.get('/:userId/schedule', scheduleController.getUserSchedule);


module.exports = router;