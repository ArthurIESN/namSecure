import type {IPoint} from "../point/point.js";
import type  {ITypeDanger} from "../type_danger/type_danger.js";

export interface IReport {
   id : number;
   date : Date;
   desciption : string;
   location : IPoint;
   level : number;
   photo_id : string;
   id_type_danger : ITypeDanger;
}