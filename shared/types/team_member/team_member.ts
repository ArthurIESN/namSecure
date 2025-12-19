import type {ITeam} from "../team/team.js";
import type {IMember} from "../member/member.js";

export interface ITeamMember {
    id : number;
    accepted : boolean;
    team? : ITeam | number;
    member : IMember | number;
}