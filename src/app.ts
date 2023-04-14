import express, { Application } from "express";

import { createDeveloper, deleteDeveloper, moreInfoFromDev, readDeveloper, updateDeveloper } from "./logic/developers";
import { ensureEmailExists, ensureIdExistsByParams, ensureInfoExists, ensureInfomation } from "./middlewares/developers";

import { createProject, createTechnologiesProject, deleteProject, deleteTechnology, readProject, updateProject } from "./logic/projects";
import { ensureIdExistsProject } from "./middlewares/project";

import "dotenv/config";

const app: Application = express();

app.use(express.json());

app.post('/developers' ,           ensureEmailExists      ,createDeveloper);                                                  
app.post('/developers/:id/infos',  ensureIdExistsByParams ,ensureInfoExists,    ensureInfomation ,moreInfoFromDev);         
app.get('/developers/:id',         ensureIdExistsByParams ,readDeveloper);                                               
app.patch('/developers/:id',       ensureIdExistsByParams ,ensureEmailExists,   updateDeveloper);                        
app.delete('/developers/:id',      ensureIdExistsByParams ,deleteDeveloper);                                          

app.post('/projects',                             ensureIdExistsProject,        createProject);                       
app.post('/projects/:id/technologies',            createTechnologiesProject);                                      
app.get('/projects/:id',                          ensureIdExistsByParams,       readProject);                        
app.patch('/projects/:id',                        ensureIdExistsByParams,       updateProject);                   
app.delete('/projects/:id',                       ensureIdExistsByParams,       deleteProject) ;                     
app.delete('/projects/:id/technologies/:name',    ensureIdExistsByParams,       deleteTechnology);              

export default app;

