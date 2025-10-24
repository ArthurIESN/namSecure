import 'express';
import { IAuthUser } from '../user/user.js';


declare global
{
    namespace Express
    {
        interface Request
        {
            validated?: any;
            user?: IAuthUser;
        }
    }
}
