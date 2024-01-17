import { athletedto } from "./athletedto";
import { club } from "./club";
import { stage } from "./stage";

export interface challenge {
    id:number,
    name:string,
    image:string,
    total_elevation_gain:number,
    description:string,
    club:club | null,
    type:string,
    start_date_local:string,
    end_date_local:string,
    stages:stage[],
    athletes?:athletedto[],
    loaded?:boolean
}
