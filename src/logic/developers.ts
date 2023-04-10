import { Request, Response } from "express";

import format from "pg-format";

import { client } from "../database";

import { QueryResult } from "pg";

type IDeveloper = {
     name: string,
     email: string
}

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

     return res.status(201).json(queryResult)

};

async function moreInfoFromDev(req:Request, res:Response): Promise<Response | void> {

};

function readDeveloper (){

};

function updateDeveloper (){

};

function deleteDeveloper (){

};

export{
     createDeveloper, readDeveloper, updateDeveloper, deleteDeveloper
}