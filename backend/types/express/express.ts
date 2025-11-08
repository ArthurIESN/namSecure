import 'express';
import {IAuthMember, IAuthUser} from '../user/user.js';


declare global
{
    namespace Express
    {
        interface Request
        {
            validated?: any; // validated data from req.body and req.query
            user?: IAuthUser; // authenticated user info from JWT token
            member?: IAuthMember; // member from the database
        }
    }
}
