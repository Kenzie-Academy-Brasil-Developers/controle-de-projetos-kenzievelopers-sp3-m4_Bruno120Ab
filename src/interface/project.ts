export interface IProject {  
     id: number,   
     name: string,
     description: string,
     estimatedTime: string,
     repository: string,
     startDate: Date,
     endDate?: Date,
     developerId?: number,
}

export type Iformation = {
     developerSince: string,
     preferredOS: "MacOS" | "Windows" | "Linux"
}

export type INameTechnology = {
     developerId: string,
     name: string,
}
export type IProjectRequest = Omit<IProject , "id">
