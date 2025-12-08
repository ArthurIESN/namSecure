import type  {ITypeDanger} from "../type_danger/type_danger.js";
import type {IMember} from "../member/member.js";

export interface IReport {
   id : number;
   date : Date;
   lat : number;
   lng : number;
   street : string;
   level : number;
   is_public : boolean;
   for_police : boolean;
   photo_path: string | null;
   member : IMember | number;
   type_danger : ITypeDanger | number;
}