export type LocationValue={id?:string;label:string;city?:string;district?:string;lat?:number;lng?:number};
export type LocationSuggestion=LocationValue & {id:string;lat:number;lng:number};
