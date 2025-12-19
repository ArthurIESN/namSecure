import { Request, Response } from 'express';
import * as memberModel from '@/models/member/member';
import { NotFoundError } from "@/errors/NotFoundError";
import { UniqueConstraintError } from "@/errors/database/UniqueConstraintError";
import fs from 'fs';
import path from 'path';

export const updateProfile = async (req: Request, res:Response): Promise<void> => {
    try{

        const userId: number = req.user!.id;

        const {address,removePhoto} = req.body;

        const profilePhoto = req.file;

        const member = await memberModel.getMember(userId);


        let newPhotoPath = member.photo_path;

        if(profilePhoto){

            newPhotoPath = profilePhoto.filename;

            if(member.photo_path){
                const oldPhotoPath = path.join(process.cwd(), 'uploads', 'profiles', member.photo_path);
                if(fs.existsSync(oldPhotoPath)){
                    fs.unlinkSync(oldPhotoPath);
                }
            }
        }else if(removePhoto === 'true'){
            if(member.photo_path){
                const oldPhotoPath = path.join(process.cwd(), 'uploads', 'profiles', member.photo_path);
                if(fs.existsSync(oldPhotoPath)){
                    fs.unlinkSync(oldPhotoPath);
                }
            }
            newPhotoPath = null;
        }

        const updateMember = {
            id: member.id,
            apple_id: member.apple_id,
            first_name: member.first_name,
            last_name: member.last_name,
            email: member.email,
            email_checked: member.email_checked,
            id_checked: member.id_checked,
            password: member.password,
            password_last_update: member.password_last_update,
            address: address || member.address,
            birthday: member.birthday,
            national_registry: member.national_registry,
            created_at: member.created_at,
            photo_path: newPhotoPath,
            role: typeof member.role === 'object' && member.role !== null ? member.role.id : member.role,
            twoFA: member.twoFA ? (typeof member.twoFA === 'object' && member.twoFA !== null ? member.twoFA.id : member.twoFA) : null,
            id_check: member.id_check ? (typeof member.id_check === 'object' && member.id_check !== null ? member.id_check.id : member.id_check) : null,
            validation_code: member.validation_code || null
        };

        await memberModel.updateMember(updateMember);

        res.status(200).json({
            message: "Profile updated successfully",
            member: {
                id: updateMember.id,
                email: updateMember.email,
                address: updateMember.address,
                photo_path: updateMember.photo_path,
                first_name: updateMember.first_name,
                last_name: updateMember.last_name,
            }
        });

    }catch (error: any){
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof UniqueConstraintError) {
            res.status(409).json({ error: "Email already in use" });
        } else {
            console.error("Error in updateProfile controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


}