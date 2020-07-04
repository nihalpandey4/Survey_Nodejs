const express =require("express");
const app=express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("styles"));
app.set("view engine","ejs")

mongoose.connect("mongodb+srv://admin_nihal:test123@cluster0.z3drp.mongodb.net/Survey?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true});

const responseSchema=new mongoose.Schema({
  email:String,
  fullName:String,
  Gender:String,
  no:Number
});

const Response=mongoose.model("Response",responseSchema);

const info={
  email:"",
  fullName:"",
  Gender:""
}

const createRecord=(info)=>{
  const response=new Response({
    email:info.email,
    fullName:info.fullName,
    Gender:info.Gender,
    no:1
  });
  response.save();
}

app.listen(3000,()=>{
  console.log("App started on port 3000");
});

app.get("/",(req,res)=>{
  res.render("index");
});

app.post("/",(req,res)=>{
  const mail=req.body.email;
  Response.find({email:mail},(err,docs)=>{
    if(err){
      res.redirect("/");
    }
    else{
      if(docs.length==0){
        info.email=mail;
        res.redirect("/survey");
      }
      else{
        info.email=docs[0].email;
        info.fullName=docs[0].fullName;
        info.Gender=docs[0].Gender;
        Response.deleteOne({email:info.email},(err,result)=>{
          if(err){
            console.log(err);
            res.redirect("/");
          }
          else{
            console.log(result);
            res.redirect("/preview");
          }
        });
      }
    }
  });
});

app.get("/survey",(req,res)=>{
  res.render("survey",{mail:info.email});
});

app.post("/survey",(req,res)=>{
  info.fullName=req.body.fullName;
  info.Gender=req.body.Gender;
  console.log(info);
  createRecord(info);
  res.redirect("/");
})

app.get("/preview",(req,res)=>{
  res.render("preview",{info:info});
});

app.post("/preview",(req,res)=>{
  if(req.body.Choice=="update"){
    res.redirect("/survey");
  }
  else{
    Response.deleteOne({email:info.email},(err,result)=>{
      if(err){
        console.log(err);
        res.redirect("/");
      }
      else{
        console.log(result);
        res.redirect("/");
      }
    });
  }
});
