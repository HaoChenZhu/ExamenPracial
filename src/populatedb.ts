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
    console.log("MongoDb coneccted");
    let seats: Seats = {
      puesto: 1,
      estado: false,
      token: undefined
    };
    var arr: Seat[] = [];
    for (let n = 1; n <= 20; n++) {
      arr.push(
        (seats = {
          puesto: n,
          estado: false,
          token:undefined
        })
      );
    }
    const sitios = arr.map((char) => {
      const { puesto, estado } = char;
      return {
        puesto: char.puesto,
        estado: char.estado,
        token: char.token
      };
    });
    const reserva: Reserva = {
      day: day,
      month: month,
      year: year,
      seat: sitios,
    };
    await client.connect();
    console.info("MongoDB connected");
    const docs = await client
      .db(dbName)
      .collection(collection)
      .countDocuments();
    if (docs > 0) {
      console.info("Characters are already in the DB");
      return client.db(dbName);
    } else {
        console.log("llll")
      for (let n = 1; n <= 10; n++) {
        await client
          .db(dbName)
          .collection(collection)
          .insertMany([{
            day: reserva.day + n,
            month: reserva.month,
            year: reserva.month,
            seat: reserva.seat,
          }]);
      }
    }

    return client.db(dbName);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
