// Simple backend for the romantic-date website.
// Run with Node.js: npm init -y && npm install express cors
// Then: node backend.js

const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = "responses.json";

app.use(cors());
app.use(express.json());

function save(item){
  let data=[];
  if(fs.existsSync(FILE)){
    try{ data=JSON.parse(fs.readFileSync(FILE,"utf8")); }catch(e){}
  }
  data.push(item);
  fs.writeFileSync(FILE, JSON.stringify(data,null,2));
}

app.post("/api/response",(req,res)=>{
  const record={
    id: Date.now(),
    event:req.body.event || "UNKNOWN",
    details:req.body.details || {},
    time:req.body.time || new Date().toISOString()
  };
 save(record);
console.log("❤️ DATE RESPONSE:", JSON.stringify(record));
res.json({ok:true});
});

// Basic private-ish dashboard. Protect this with a real auth system before public use.
app.get("/api/responses",(req,res)=>{
  if(!process.env.ADMIN_KEY || req.query.key !== process.env.ADMIN_KEY){
    return res.status(401).json({error:"Unauthorized"});
  }
  let data=[];
  if(fs.existsSync(FILE)){
    try{data=JSON.parse(fs.readFileSync(FILE,"utf8"));}catch(e){}
  }
  res.json(data);
});

app.listen(PORT,()=>console.log(`Backend running on port ${PORT}`));
