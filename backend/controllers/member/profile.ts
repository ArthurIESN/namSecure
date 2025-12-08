import { Request, Response } from 'express';
import * as memberModel from '@/models/member/member';
import { NotFoundError } from "@/errors/NotFoundError";
import { UniqueConstraintError } from "@/errors/database/UniqueConstraintError";
import fs from 'fs';
import path from 'path';

export const updateProfile = async (req: Request, res:Response): Promise<void> => {
    try{

        const userId = req.user!.id;

        const {email,address,removePhoto} = req.body;

        const profilePhoto = req.file;

        const member = await memberModel.getMember(userId);


        let newPhotoPath = member.photo_path;

        // user uploaded a new profile photo
        if(profilePhoto){

            newPhotoPath = profilePhoto.filename;

            //remove old photo if exists
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
            ...member,
            email: email || member.email,
            address: address || member.address,
            photo_path: newPhotoPath
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