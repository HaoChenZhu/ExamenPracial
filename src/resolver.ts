import { Request, Response } from "express";
import { Db } from "mongodb";
import { empty, uuid } from "uuidv4";
import moment from "moment";
import { token } from "morgan";
const checkDateValidity = (
  day: number,
  month: number,
  year: number
): boolean => {
  const date = moment(`${year}-${month}-${day}`);

  return date.isValid();
};

export const signin = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("Usuarios");
  const user = req.body;
  const validate = await collection.findOne({ email: user.email });
  if (!user) return res.status(500).send("No params");
  if (!validate) {
    await collection.insertOne({
      email: user.email,
      password: user.password,
      token: undefined,
      booking: [],
    });
    return res.status(200).json({
      email: user.email,
      password: user.password,
    });
  } else {
    return res.status(409).json({
      Error: "Ya existe el usuario",
    });
  }
};
export const login = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("Usuarios");
  const user = req.body;
  const token = uuid();
  const validate = await collection.findOne({
    email: user.email,
    password: user.password,
    token: null,
  });
  //if (!req.body) return res.status(500).send("No params");
  if (validate) {
    await collection.updateOne(
      { email: user.email, password: user.password },
      { $set: { token: token } }
    );
    res.status(200).json({
      Token: token,
    });
  } else {
    res.status(401).json({
      Error: "Ya estas logeado",
    });
  }
};
export const logout = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("Usuarios");
  const token = req.headers.token;
  const validate = await collection.findOne({
    token: token,
  });
  if (!req.headers) return res.status(500).send("No params");
  if (validate) {
    await collection.updateOne(
      { token: token },
      { $set: { token: undefined } }
    );
    res.status(200).json({
      User: "Log Out",
    });
  } else {
    res.status(500).json({
      Error: "Error",
    });
  }
};

export const freeseats = async (req: Request, res: Response) => {
  const day = parseInt(req.query.day as string);
  const month = parseInt(req.query.month as string);
  const year = parseInt(req.query.year as string);
  const db: Db = req.app.get("db");
  const collection = db.collection("Reserva");
  if (!checkDateValidity(day, month, year)) {
    return res.status(500).send("Invalid Date");
  }
  const free = await collection
    .find({
      day: day,
      month: month,
      year: year,
    })
    .toArray();
  const freeseats: any = [];

  return res.status(200).json(FreeSeats(free));
};
function FreeSeats(free: any) {
  const freeseats: any = [];
  free.forEach((e: any) => {
    freeseats.push(e.seat);
  });
  const libres: any = [];
  freeseats.forEach((element: any) => {
    console.log(
      element.forEach((elm: any) => {
        if (elm.email == null) libres.push(elm);
      })
    );
  });
  return libres;
}
export const book = async (req: Request, res: Response) => {
  const day = parseInt(req.query.day as string);
  const month = parseInt(req.query.month as string);
  const year = parseInt(req.query.year as string);
  const puesto = parseInt(req.query.puesto as string);
  const token = req.headers.token;
  const db: Db = req.app.get("db");
  const collection = db.collection("Reserva");
  if (!checkDateValidity(day, month, year) || puesto>20) {
    return res.status(500).send("Invalid Date or Book");
  }
  const a = await collection.updateOne(
    {
      day: day,
      month: month,
      year: year,
      "seat.puesto": puesto,
      "seat.email": null,
    },
    { $set: { "seat.$.email": true } }
  );
  if (a) {
    const datos = {
      day: day,
      month: month,
      year: year,
      puesto: puesto,
    };
    res.status(200).send(datos);
    await db
      .collection("Usuarios")
      .updateOne({ token: token }, { $push: { booking: datos } });
  } else {
    res.status(404);
  }
};
export const free = async (req: Request, res: Response) => {
  const user = req.body;
  const token = req.headers.token;
  const db: Db = req.app.get("db");
  const collection = db.collection("Reserva");
  if (!checkDateValidity(user.day,user.month,user.year)) {
    return res.status(500).send("Invalid Date");
  }
  await db
      .collection("Usuarios")
      .updateOne({
         token:token }, {$pull:{'bookink':{'booking.puesto':user.day,'booking.month':user.month,'booking.year':user.year}}});
  /*const free = await collection
    .findOne({
      day: user.day,
      month: user.month,
      year: user.year,
    });
 const array:{puesto:number,email:boolean}[]=free.seat;
  const asientosLibres=(array.map((elm)=>{
    if(elm.email == null){
      return console.log(elm.puesto)
    }
  }))
  const freeseats: any = []; */
  return res.status(200).json(1);
};
export const mybookings=async(req:Request,res:Response)=>{
  const token = req.headers.token;
  const db: Db = req.app.get("db");
  const collection = db.collection("Usuarios");
  const boo:any = await collection
    .findOne({
      token: token
  });
  const array:{day:number,month:number,year:number,puesto:number}[]=boo.booking
  console.log(array);
  console.log(array.length);
 
  if(array.length>0){
    array.forEach((elem)=>{
      
      return res.status(200).json(elem);
    })
 
  }else{
    return res.status(404).json();
  }
    
  
  

  
}
