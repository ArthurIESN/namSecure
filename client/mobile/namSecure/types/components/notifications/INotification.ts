export interface INotification {
    id : number;
    type: 'report' | 'group';
    name : string;
    street? : string;
    level? : number;
    icon : string;
    date : string;
}