var express = require('express');
var router = express.Router();
var path = require("path");
var fs= require("fs");
var multer = require('multer');
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        var newFolder = null;
        if(req.params.projectName){
              newFolder = path.join(__dirname , "../" , "mockJsons",req.params.projectName);
        var statObject = null;
        try{
            statObject = fs.statSync(newFolder);
        }catch(e){
            fs.mkdirSync(newFolder);
        }
        }else{
            newFolder = path.join(__dirname , "../" , "mockJsons");
        }
        cb(null ,newFolder);
    },
    filename : function(req,file,cb){
        cb(null , file.originalname);
    }
});
var upload = multer({storage:storage});
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname , "../" ,"views" , "index.html"));
});
router.post('/mockList' , function(req,res){
   var projectFolder = req.body.projectName;
      fs.readdir(path.join(__dirname , "../" , "mockJsons" ,projectFolder) , function(error,files){
        var tempObj = {};
        if(error && error.code == "ENOENT"){
            tempObj.status = "failure";
            tempObj.fileList = [];
           res.end(JSON.stringify(tempObj));
        }else{
            tempObj.status = "success";
            tempObj.fileList = files;
            res.end(JSON.stringify(tempObj));
        }
    });
});
router.get('/downloadMock/:projectName/:fileName' , function(req,res){
    var projectName = req.params.projectName;
    var fileName = req.params.fileName;
    res.download(path.join(__dirname , "../" , "mockJsons" , projectName , fileName));   
});
router.get('/projectList' , function(req,res){
    fs.readFile(path.join(__dirname , "../" , "mockJsons" , "projects.json") , function(error,response){
        if(error && error.code == "ENOENT"){
           res.status(404).send("REQUESTED JSON NOT FOUND"); 
        }else{
           res.end(response); 
        }
    }); 
});
router.put('/saveProjectList' , function(req,res){
    fs.writeFileSync(path.join(__dirname , "../" , "mockJsons" , "projects.json") , JSON.stringify(req.body) , 'utf-8');
        res.json({status:"SUCCESS"}); 
});
router.post('/deleteMock' , function(req,res){
    var projectName = req.body.projectName;
    var fileName = req.body.filename;
    fs.unlink(path.join(__dirname , "../" , "mockJsons" ,projectName, fileName),function(error , response){
       if(error && error.code == "ENOENT"){
           res.status(404).send("REQUESTED JSON NOT FOUND"); 
        }else{
            res.json({status:"success"});
        }
    });
      
});
router.get('*' , function(req,res){
    var arr = require("url").parse(req.url).pathname.split("/");
    var length = arr.length;
    var projectName = arr[1];
    var relativeUrl = arr[length-1];
    fs.readFile(path.join(__dirname , "../" , "mockJsons" , projectName, relativeUrl+ ".json") , function(error,response){
        if(error && error.code == "ENOENT"){
           res.status(404).send("REQUESTED JSON NOT FOUND"); 
        }else{
           res.end(response); 
        }
    });
});

router.post('*' , function(req,res){
    var arr = require("url").parse(req.url).pathname.split("/");
    var length = arr.length;
    var projectName = arr[1];
    var relativeUrl = arr[length-1];
    fs.readFile(path.join(__dirname , "../" , "mockJsons" , projectName, relativeUrl+ ".json") , function(error,response){
        if(error && error.code == "ENOENT"){
           res.status(404).send("REQUESTED JSON NOT FOUND"); 
        }else{
           res.end(response); 
        }
    });
});


router.put('/upload/:projectName' , upload.any() , function(req,res){
        res.json({status:"SUCCESS"}); 
});

module.exports = router;
