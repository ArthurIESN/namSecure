export interface LocationState {
    address : string;
    coordinates : {
        latitude : number;
        longitude : number;

    } | null;
    loading : boolean;
    error : string | null;
}