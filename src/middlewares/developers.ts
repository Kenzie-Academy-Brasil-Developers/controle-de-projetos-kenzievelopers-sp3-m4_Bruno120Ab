import { NextFunction, Request, Response } from "express";

import { QueryConfig, QueryResult } from "pg";

import format from "pg-format";

import { client } from "../database";
import { Iformation } from "../interface/project";

async function ensureIdExistsDev(req:Request, res:Response, next:NextFunction): Promise<Response | void>{
     const { id } = req.params;
     const url = req.route;

     const queryString:string = `
          SELECT 
               id 
          FROM 
               developers
          WHERE
               id = $1
     `

     const queryConfig:QueryConfig = {
          text: queryString,
          values: [id]
     }

     const queryResult:QueryResult =  await client.query(queryConfig);

     if(queryResult.rowCount === 0) {
          if( url.path == '/projects/:id'){
               return res.status(404).json({ message: "Project not found."})
          }else{
               return res.status(404).json({ message: "Developer not found."})

          }
     }
     
     return next()
};

async function ensureIdExistsByParams(req:Request, res:Response, next:NextFunction): Promise<Response | void>{
     const url = req.route;
     const { id } = req.params;

     if( url.path == '/projects/:id' || url.path == '/projects/:id/technologies' || url.path == '/projects' || url.path == '/projects/:id/technologies/:name'){
          const queryString:string = `
               SELECT 
                    id 
               FROM 
                    projects
               WHERE
                    id = $1
          `
     
          const queryConfig:QueryConfig = {
               text: queryString,
               values: [id]
          }
     
          const queryResult:QueryResult =  await client.query(queryConfig);

          if(queryResult.rowCount === 0) {
               return res.status(404).json({ message: "Project not found."})
          }

          return next()
     }else{
          const queryString:string = `
               SELECT 
                    id 
               FROM 
                    developers
               WHERE
                    id = $1
          `

          const queryConfig:QueryConfig = {
               text: queryString,
               values: [id]
          }

          const queryResult:QueryResult =  await client.query(queryConfig);

          if(queryResult.rowCount === 0) {
               return res.status(404).json({ message: "Developer not found."})
          }

          return next()

     }
}

async function ensureNameExists(req:Request, res:Response, next:NextFunction): Promise<Response | void>{
     const { name } = req.body;

     const queryString:string = `
          SELECT 
               name 
          FROM 
               developers
          WHERE
               name = $1
     `

     const queryConfig:QueryConfig = {
          text: queryString,
          values: [name]
     }

     const queryResult:QueryResult =  await client.query(queryConfig);

     if(queryResult.rowCount === 0) {
          return next()
     }

     return res.status(404).json({ error: "Name already exists"})
};

async function ensureEmailExists(req:Request, res:Response, next:NextFunction): Promise<Response | void>{
     const  email:string  = req.body.email;

     const queryString:string = `
          SELECT 
               email 
          FROM 
               developers
          WHERE
               email = $1
     `

     const queryConfig:QueryConfig = {
          text: queryString,
          values: [email]
     }

     const queryResult:QueryResult =  await client.query(queryConfig);

     if(queryResult.rowCount === 0) {
          return next()
     }

     return res.status(409).json({message: "Email already exists."})
};

async function ensureInfoExists(req: Request, res: Response, next:NextFunction): Promise<Response | void> {
     const id:number  = parseInt(req.params.id);

     const queryString: string = 
          `
          SELECT 
               "developerSince" as data,
               "preferredOS" as SO
          FROM
               developer_infos
          WHERE
               id = $1;
          `
     
     const queryConfig:QueryConfig = {
          text: queryString,
          values: [id]
     }

     const queryResult:QueryResult = await client.query(queryConfig)

     if( queryResult.rowCount === 0){
          return next()
     }

     return res.status(409).json({message: "Developer infos already exists."})
};

function ensureInfomation(req: Request, res:Response, next:NextFunction) {
     const payload:Iformation = req.body;
     const SO = ['Windows', 'MacOS', 'Linux']

     if(!SO.includes(payload.preferredOS)){
          return res.status(400).json({
               "message": "Invalid OS option.",
               "options": ["Windows", "Linux", "MacOS"]
             })
     }

     return next()
}

export {
     ensureIdExistsDev,
     ensureNameExists,
     ensureEmailExists,
     ensureInfoExists,
     ensureInfomation,
     ensureIdExistsByParams
}