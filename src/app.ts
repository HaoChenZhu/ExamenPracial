import express from "express";
import { getAndSaveSeats } from "./populatedb";
import { Db } from "mongodb";
import {
  book,
  free,
  freeseats,
  login,
  logout,
  mybookings,
  signin,
} from "./resolver";
const run = async () => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  const db: Db = await getAndSaveSeats();
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set("db", db);
  var middleware = {
    uno: "/logout",
    dos: "/freeseats",
    tres: "/book",
    cuatro: "/free",
    cinco: "/mybookings",
  };
  app.use(
    [
      middleware.uno,
      middleware.dos,
      middleware.tres,
      middleware.cuatro,
      middleware.cinco,
    ],
    async (req, res, next) => {
      console.log(req.query.token || "No token");
      console.log(req.headers["auth-token"]);
      const db: Db = req.app.get("db");
      const token = req.headers.token;
      const email = req.headers.email;
      if (!req.headers) return res.status(500).send("No params");
      if (!token || !email)
        return res.status(500).send("Missing email - token");
      const user = await db
        .collection("Usuarios")
        .findOne({ email: email, token: token });
      if (user) {
        console.log("true");
        next();
      } else {
        console.log("error");
        res.send("Error");
      }
    }
  );
  app.get("/status", async (req, res) => {
    res.status(200).send({
      Body: `${day}-${month}-${year}`,
    });
  });
  app.post("/signin", signin);
  app.get("/login", login);
  app.get("/logout", logout);
  app.get("/freeseats", freeseats);
  app.get("/book", book);
  app.get("/free", free);
  app.get("/mybookings", mybookings);
  await app.listen(9000);
};
try {
  run();
} catch (error) {
  console.log(error);
}
