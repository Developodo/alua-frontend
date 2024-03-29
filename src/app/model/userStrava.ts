export interface userStrava {
    access_token:string,
    athlete:{
        badge_type_id?:number,
        bio?:string,
        city?:string,
        country?:string,
        created_at?:string,
        firstname?:string,
        follower?:any,
        friend?:any,
        id:number,
        lastname?:string,
        premium?:boolean,
        profile?:string,
        profile_medium?:string,
        resource_state?:number,
        sex?:string,
        state?:string,
        summit?:boolean,
        updated_at?:string,
        username?:string,
        weight?:number
        clubs?:any
    },
    expires_at:number,
    expires_in:number,
    refresh_token:string,  
    token_type:string
}