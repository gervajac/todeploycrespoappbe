import express, { Request, Response } from "express";
import cors from "cors";
import dynamoose from "dynamoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import http from "http";
import { router } from "./routes";
import dynamodb from "./config/dynamo";

dotenv.config();

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3001;

app.use(bodyParser.json({ limit: "1000kb" }));
app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", (req: Request, res: Response) => {
    res.send("welcome to concursocrespoapp backend");
});

dynamoose.aws.ddb.set(dynamodb);
app.get("/test-dynamodb-connection", (req, res) => {
    dynamodb.listTables({}, (err, data) => {
        if (err) {
            console.error("Error al conectar a DynamoDB:", err);
            res.status(500).json({ error: "Error al conectar a DynamoDB" });
        } else {
            console.log("Conexión exitosa a DynamoDB");
            res.json({ msg: "Conexión exitosa a DynamoDB" });
        }
    });
});

server.listen(port, () => console.log("server listening on port", port));
