import { QueryConfig, QueryResult } from "pg";

import { client } from "../database";

import { NextFunction, Request, Response } from "express";

async function ensureIdExistsProject(req:Request, res:Response, next:NextFunction): Promise<Response | void>{
     const id = parseInt(req.body.developerId);

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
          return res.status(404).json({ message: "Developer not found."
     })

     }

     return next()
};

export {
     ensureIdExistsProject,
}