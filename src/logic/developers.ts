import { Request, Response } from "express";

import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";

import { client } from "../database";

import { IDeveloper, IDeveloperReq } from "../interface/developer";

async function createDeveloper (req:Request, res:Response): Promise<Response | void> {
     const payload:IDeveloper = req.body;

     const queryString:string = format(
          `
               INSERT INTO 
                    developers(%I)
               VALUES
                    (%L)
               RETURNING *;
          `,
          Object.keys(payload),
          Object.values(payload)
     )
     
     const queryResult:QueryResult = await client.query(queryString)

     return res.status(201).json(queryResult.rows[0]);
};

async function moreInfoFromDev(req:Request, res:Response): Promise<Response | void> {
     const infoData:IDeveloperReq = req.body;
     infoData.developerId = req.params.id;

     const queryString:string = format(
          `
               INSERT INTO
                    developer_infos (%I)
               VALUES
                    (%L)
               RETURNING *;
          `,
          Object.keys(infoData),
          Object.values(infoData)
     )

     const queryResult:QueryResult = await client.query(queryString)

     return res.status(201).json(queryResult.rows[0])
};

async function readDeveloper (req:Request, res:Response): Promise<Response | void>{
     const  id:number  = parseInt(req.params.id);

     const queryString: string = `
          SELECT
               dev."id" "developerId",
               dev."name" "developerName",
               dev."email" "developerEmail",
               di."developerSince" "developerInfoDeveloperSince",
               di."preferredOS" "developerInfoPreferredOS"
          FROM 
               developers dev
          LEFT JOIN
               developer_infos di  
               ON di."developerId" = dev.id
          WHERE
               dev.id = $1;
     `
     
     const queryConfig: QueryConfig = {
          text: queryString,
          values: [id]
     };

     const queryResult: QueryResult = await client.query(queryConfig);

     return res.status(200).json(queryResult.rows[0]);
};

async function updateDeveloper (req:Request, res:Response): Promise<Response | void>{
     const id: number = parseInt(req.params.id)
     const payload = req.body;

     const queryString:string = format(`
          UPDATE 
               developers
          SET(%I) = ROW(%L)
          WHERE 
               "id" = $1
          RETURNING *;
     `,
     Object.keys(payload),
     Object.values(payload)
     )

     const queryConfig: QueryConfig = {
          text: queryString,
          values: [id],
      }

     const queryResult: QueryResult = await client.query(queryConfig)

     return res.status(200).json(queryResult.rows[0])

};

async function deleteDeveloper (req:Request, res:Response): Promise<Response | void>{
     const id:number = parseInt(req.params.id);

     const queryString = `
          DELETE FROM
               developers
          WHERE
               id = $1
     `

     const queryConfig:QueryConfig = {
          text: queryString,
          values: [id]
     }

     await client.query(queryConfig)

     return res.status(204).send()
};

export{
     createDeveloper,
     moreInfoFromDev, 
     readDeveloper, 
     updateDeveloper, 
     deleteDeveloper
}