import express, { Application } from "express";
import "dotenv/config";

const app: Application = express();

app.use(express.json());

app.post('/developers',);               // Register new developer
app.post('/developers/:id/infos',);     // Register more infos the developer
app.get('/developers/:id',);            // List developer and projects
app.patch('/developers/:id',);          // Actualize Developer
app.delete('/developers/:id',)          // Register info in a developer

export default app;


