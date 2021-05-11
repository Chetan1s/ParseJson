const path=require('path');

const express=require('express');

const rootDir=require('../util/path');
const router=express.Router();

router.get('/add-product',(req,res,next)=>{
    // res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit" name="click me"></button>') 
    res.sendFile(path.join(rootDir,'views','add-product.html'));
});

router.post('/product',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
});

module.exports=router;