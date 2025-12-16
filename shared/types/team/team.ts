import type {IMember} from "../member/member.js";
import type {IReport} from "../report/report.js";
export interface ITeam {
    id : number;
    name : string;
    admin : IMember | number;
    report : IReport | null;
}