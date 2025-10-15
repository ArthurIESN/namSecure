import prisma from '../../database/databasePrisma.js';
import { verifyPassword} from "../../utils/hash/hash.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { signJWT } from "../../utils/jwt/jwt.js";


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

    const isValid = await verifyPassword(member.password, password);

    if(!isValid)
    {
        throw new NotFoundError("Invalid credentials");
    }

    const token: string = signJWT({id: member.id, email: member.email, roleId: member.id_role, emailChecked: member.email_checked, idChecked: member.id_checked});

    return token;
}