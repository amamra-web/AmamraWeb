var express = require('express');
var router =  express.Router();
var http = require('http');

//Home page
router.get('/', function(req,res,next){
    res.render('pages/index', {title:'Test Express home'})
});
//Dashboard
router.get('/dashboard', function(req,res,next){
    res.render('pages/dashboard')
});
//Competition
router.get('/competition', function(req,res,next){
    res.render('pages/index')
});
//HW
router.get('/homework', function(req,res,next){
    res.render('pages/homework')
});
//Quiz
router.get('/quiz', function(req,res,next){
    res.render('pages/quiz')
});
//Labs
router.get('/lab', function(req,res,next){
    res.render('pages/lab')
});
//faq
router.get('/faq', function(req,res,next){
    res.render('pages/faq')
});


router.get('/ejs-test', (req,res,next) => {
    res.render('pages/test', {
        title:'Test Ejs Page',
        showTitle:false,
        data:['1sdfghhjkkj','2dsfgde','3fdgd','4asd']

    })
});

module.exports = router;