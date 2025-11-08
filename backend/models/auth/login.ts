import prisma from '../../database/databasePrisma.js';
import { verifyHash} from "../../utils/hash/hash.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { signJWT } from "../../utils/jwt/jwt.js";
import {IAuthUser} from "../../types/user/user";

export const login = async (email: string, password: string) : Promise<string> =>
{
    const member = await prisma.member.findUnique({
        where: {
            email: email
        }
    });

    if(!member)
    {
        throw new NotFoundError("Member not found");
    }

    console.log(member.password);
    const isValid = await verifyHash(member.password, password);


    if(!isValid)
    {
        throw new NotFoundError("Invalid credentials");
    }

    const authUser: IAuthUser =
    {
        id: member.id,
        email: member.email,
        twoFactorVerified: false,
    }

    return await signJWT(authUser);
}