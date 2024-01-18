export interface stage{
    id:number
    name:string
    activity_type:string
    distance:number
    start_latlng:[number,number],
    end_latlng:[number,number],
    total_elevation_gain:number,
    map:{
        polyline:string
    }
    type:string
    date:any,
    anydate:any,
    reps?:any,
}


