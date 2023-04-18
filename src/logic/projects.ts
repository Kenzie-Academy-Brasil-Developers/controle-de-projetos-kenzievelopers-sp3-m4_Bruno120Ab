import { Request, Response } from "express";

import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";

import { client } from "../database";

import { IProject, IProjectRequest, INameTechnology } from "../interface/project";

async function createProject(req:Request, res:Response): Promise<Response | void> {
     const payload:IProjectRequest = req.body;

     const queryString: string = format(`
          INSERT INTO 
               projects(%I)
          VALUES
               (%L)
          RETURNING *;
     `,
     Object.keys(payload),
     Object.values(payload)
     )

     const queryResult:QueryResult<IProject> = await client.query(queryString)

     return res.status(201).json(queryResult.rows[0])
}

async function moreInfoFromProject(req:Request, res:Response): Promise<Response | void> {
     const payload:INameTechnology = req.body;
     payload.developerId = req.params.id;

     const queryString:string = format(
          `
               INSERT INTO
                    projects(%I)
               VALUES
                    (%L)
               RETURNING *;
          `,
          Object.keys(payload),
          Object.values(payload)
     )

     const queryResult:QueryResult = await client.query(queryString)

     return res.status(201).json(queryResult.rows[0])
};

async function readProject (req:Request, res:Response): Promise<Response | void>{
     const id:number  = parseInt(req.params.id);

     const queryString: string = `
          SELECT 
               p."id"  		     "projectId",
               p."name" 			"projectName",
               p."description"  	"projectDescription",
               p."estimatedTime" 	"projectEstimatedTime",
               p."repository"		"projectRepository",
               p."startDate" 		"projectStartDate",
               p."endDate"  		"projectEndDate",
               p."developerId" 	"projectDeveloperId",
               t."id" 			"technologyId",
               t."name"			"technologyName"
          FROM 
               projects  p    
          FULL OUTER JOIN 
               technologies t 
          ON 
               p."id"  = t."id" 
          WHERE 
               P.id = $1;
     `
     
     const queryConfig: QueryConfig = {
          text: queryString,
          values: [id]
     };

     const queryResult: QueryResult = await client.query(queryConfig);

     return res.status(200).json([queryResult.rows[0]]);
};

async function updateProject(req: Request, res: Response): Promise<Response>{
     const id: number = parseInt(req.params.id);
     const payload:IProjectRequest = req.body;
     const idBody:number = parseInt(req.body.developerId);

     const queryTemplate:string = `
          SELECT 
               * 
          FROM 
               developers
          WHERE
               id = $1
          
     `

     const queryconfig:QueryConfig = {
          text: queryTemplate,
          values: [idBody]
     }
     const queryResultDevId = await client.query(queryconfig)

     if( queryResultDevId.rowCount === 0){
          return res.status(404).json({message: "Developer not found!"})
     }
 
     const queryString: string = format(
     `
          UPDATE 
               projects
          SET(%I) = ROW(%L)
          WHERE 
               "id" = $1
          RETURNING *; 
     `,
     Object.keys(payload),
     Object.values(payload)
     )

     const queryConfig:QueryConfig = {
          text: queryString,
          values:[id]
     }

     const queryResult:QueryResult<IProject> = await client.query(queryConfig)

     return res.status(200).json(queryResult.rows[0])
}

async function deleteProject(req: Request, res: Response): Promise<Response>{
     const id:number = parseInt(req.params.id);

     const queryString:string = `
          DELETE FROM
               projects
          WHERE
               id = $1;
     `

     const queryConfig:QueryConfig = {
          text: queryString,
          values: [id]
     }

     await client.query(queryConfig);

     return res.status(204).send()
}

async function deleteTechnology( req: Request, res: Response): Promise<Response>{
     const { id: projectId, name: nameTechonology } = req.params

     const queryVerificationData = `
          SELECT 
               *
          FROM
               technologies
          WHERE
               name = $1;
     `

     const queryConfigVD = {
          text: queryVerificationData,
          values: [nameTechonology]
     }

     const queryResultVD = await client.query(queryConfigVD);

     if( queryResultVD.rowCount === 0){
          return res.status(400).json({
               "message": "Invalid OS option.",
               "options": ["Windows", "Linux", "MacOS"]
             })    
     }

     const queryVerificationTechInProject = `
          SELECT 
               *
          FROM 
               projects_technologies
          WHERE 
               "projectId" = $1;
     `

     
     const queryConfigVTIP = {
          text: queryVerificationTechInProject,
          values: [projectId]
     }

     const queryResultVTIP = await client.query(queryConfigVTIP);

     if( queryResultVTIP.rowCount === 0){
          return res.status(400).json({
               "message": "Project is not found"})    
     }

     const queryString: string = `
         DELETE FROM 
               projects_technologies
         WHERE 
             "id" = $1;
     `
 
     const queryConfig: QueryConfig = {
         text: queryString,
         values: [projectId]
     }
 
     await client.query(queryConfig)
 
     return res.status(204).send()
}

async function createTechnologiesProject (  req: Request, res: Response ): Promise<Response>{
     const  name:string  = req.body.name; 
     const projectId:number = parseInt(req.params.id);

     const queryVerificationId = `
          SELECT
               *
          FROM
               projects
          WHERE
               id = $1;
     `

     const queryConfigId = {
          text: queryVerificationId,
          values: [projectId]
     }

     const queryResultVI:QueryResult = await client.query(queryConfigId)

     if( queryResultVI.rowCount === 0 ){
          return res.status(404).json({
               "message": "Projeto not found!",
          })
     }else{
          const queryVerificationName = `
               SELECT
                    *
               FROM
                    technologies
               WHERE
                    "name" = $1;
          
          `

          const queryConfigName= {
               text: queryVerificationName,
               values: [name]
          }

          const queryResultN:QueryResult = await client.query(queryConfigName)

          if( queryResultN.rowCount === 0){
               return res.status(400).json({
                    "message": "Invalid OS option.",
                    "options": ["Windows", "Linux", "MacOS"]
                  })
          }else{
               const queryVerificationData = `
                    SELECT
                         *
                    FROM
                         projects_technologies
                    WHERE
                         "projectId" = $1;
               `

               const queryConfigData = {
                    text: queryVerificationData,
                    values: [projectId]
               }

               const queryResultD:QueryResult = await client.query(queryConfigData)

               if( queryResultD.rowCount === 0){

                    const queryAll = `
                    SELECT
                         t."id"              "technologyId",
                         t."name"            "technologyName", 
                         p."id"              "projectId",
                         p."name"            "projectName",
                         p."description"     "projectDescription",
                         p."estimatedTime"   "projectEstimatedTime",
                         p."startDate"       "projectStartDate",
                         p."endDate"         "projectEndDate",
                         p."developerId"     "projectDeveloperId",
                         p."repository"      "projectRepository"
                    FROM 
                         projects  p    
                    FULL OUTER JOIN 
                         technologies t 
                    ON 
                         p.id  = t.id 
                    WHERE 
                         p.id = $1;
                    `
                    const queryConfigAll = {
                         text: queryAll,
                         values: [projectId]
                    }

                    const queryresultAll = await client.query(queryConfigAll);

                    const queryString = `
                    SELECT 
                         p."id"  			"projectId",
                         p."startDate" 		"addedIn",
                         t."id" 			"technologyId"
                    FROM 
                         projects  p    
                    FULL OUTER JOIN 
                         technologies t 
                    ON 
                         p.id  = t.id 
                    WHERE 
                         p.id = $1;
                    `
                    const queryConfig = {
                         text: queryString,
                         values: [projectId]
                    }

                    const result = await client.query(queryConfig);

                    const queryInsertDate: string = format(`
                         INSERT INTO 
                              projects_technologies(%I)
                         VALUES
                              (%L)
                         RETURNING *;
                    `,
                    Object.keys(result.rows[0]),
                    Object.values(result.rows[0])
                    )

                    const queryResp =  await client.query(queryInsertDate);

                    return res.status(201).json(queryresultAll.rows[0])
               }else{
                    return res.status(409).json({
                         "message": "technologie already exists in this project",
                    })
               }
          }
     }



}
 
export{
     createProject,
     createTechnologiesProject,
     readProject,
     moreInfoFromProject,
     updateProject,
     deleteProject,
     deleteTechnology
}

