const express=require('express');
const router=express.Router();

// @route GET api/posts
// @description : 
// Access :public

router.get('/',(req,res)=>res.send('Posts Route'));

module.exports=router;
