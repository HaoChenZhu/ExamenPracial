import { Request, Response } from "express";
import { Db } from "mongodb";
import { uuid } from 'uuidv4';


export const libres = async (req: Request, res: Response) => {
    const day= req.query.day;
    const month = req.query.month;
    const year = req.query.year;
    const db: Db = req.app.get("db");
   try {
   await db.collection("Reserva").findOne({
      day:day,
      month:month,
      year:year,
    }).then((result)=>{
      res.status(200).send(result)
    })
   } catch (error) {
     console.log(error);
     res.status(500);
   }
   
};

export const book = async (req: Request, res: Response) => {
  const day= req.query.dia;
  const month = req.query.month;
  const year = req.query.year;
  const puesto = req.query.puesto;
  const db: Db = req.app.get("db");
  const token= uuid();
 try {
  const fecha = await db.collection("Reserva").updateOne({
  day:day,
  month:month,
  year:year,
  seat:{ puesto
  }
  },{$set:{seat:{estado:true,token:token}}}).then(()=>{
    res.status(200).send(token)
  })
 } catch (error) {
   res.status(404);
 }
 
};

