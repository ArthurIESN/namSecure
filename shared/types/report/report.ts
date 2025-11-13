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
   photo_path: string;
   member : IMember;
   type_danger : ITypeDanger;
}