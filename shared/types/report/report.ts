import type {IPoint} from "../point/point.js";
import type  {ITypeDanger} from "../type_danger/type_danger.js";
import type {IMember} from "../member/member.js";

export interface IReport {
   id : number;
   date : Date;
   lat : number;
   lng : number;
   street : string;
   level : number;
   photo_path: string;
   member : IMember;
   type_danger : ITypeDanger;
}