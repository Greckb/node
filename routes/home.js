const express = require('express');
const router = express.Router();


router.get('/', (req,res) =>{
    const urls = [
        {origen: "www.google.com/bluuweb", shortURL: "dsfdsfds1" },
        {origen: "www.google.com/bluuweb2", shortURL: "dsfdsfds2" },
        {origen: "www.google.com/bluuweb3", shortURL: "dsfdsfds3" },
    ]
    res.render('home', {urls: urls});
})



module.exports = router