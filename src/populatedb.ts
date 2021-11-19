import { Reserva, Seat, Seats } from "./types";
import { Db, MongoClient } from "mongodb";
export const getAndSaveSeats = async (): Promise<Db> => {
  const dbName: string = "ExamenParcial";
  const collection: string = "Reserva";

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const user = "user";
  const password = "user";
  const mongouri: string = `mongodb+srv://${user}:${password}@cluster0.gw7id.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  const client = new MongoClient(mongouri);
  try {
    await client.connect();
    if(client)
    console.log("MongoDb coneccted");
    let seats: Seats = {
      puesto: 1,
      email: undefined
    };
    var arr: Seat[] = [];
    for (let n = 1; n <= 20; n++) {
      arr.push(
        (seats = {
          puesto: n,
          email:undefined
        })
      );
    }
    const reserva: Reserva = {
      day: day,
      month: month,
      year: year,
      seat: arr.map((char) => {
        return {
          puesto: char.puesto,
          email: char.email,
        }
      })
    };
    const docs = await client
      .db(dbName)
      .collection(collection)
      .countDocuments();
    if (docs > 0) {
      console.info("Books are already in the DB");
      return client.db(dbName);
    } else {
      for (let n = 1; n <= 10; n++) {
        await client
          .db(dbName)
          .collection(collection)
          .insertMany([{
            day: reserva.day + n,
            month: reserva.month,
            year: reserva.year,
            seat: reserva.seat,
          }]);
          console.log("Insertado %d",n);
      }
    }
    return client.db(dbName);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
