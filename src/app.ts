import express from "express";
import { getAndSaveSeats } from "./populatedb";
import { Db } from "mongodb";
import { book, libres } from "./resolver";
const app = express();

const run= async()=>{
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    const db: Db = await getAndSaveSeats();

    const app=express();
    app.set("db", db);

    var middleware={
        uno:"/characters",
        dos:"/character/:id"
      }
      app.use([middleware.uno,middleware.dos],async(req, res, next) => {
      console.log(req.query.token || "No token");
      console.log(req.headers["auth-token"]);
      const db: Db = req.app.get("db");
      const username= req.headers.username;
      const token= req.headers.token;
      const user= await db.collection("usuarios").findOne({username:username,
        token: token})
      if(user){
        console.log("true")
        next();
      }else{
        res.send("Error")
      }  
      });
    app.get("/status", async (req, res) => {
        res.status(200).send({
        Body:`${day}-${month}-${year}`
    })});

    app.get("/freeseats",libres);
    app.get("/book",book);
    await app.listen(3000);
}
try{
    run();
}catch(error){
    console.log(error);
}