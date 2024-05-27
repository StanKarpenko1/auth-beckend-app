import express from 'express';
import {  merge } from 'lodash';

import { getUserBySessionToken } from '../db/users'; 

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {id} = req.params;
        //@ts-ignore
        const currentUserId = get(req, 'identety._id') as string

        if (!currentUserId){
            return res.sendStatus(403)
        }

        if (currentUserId.toString() !== id){
            return res.status(403)
        }

        next()

    } catch (err) {
        console.log(`from isOwner error: ${err}`)
        return res.sendStatus(400)
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['STAN-AUTH'];
        if (!sessionToken){
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);
        if(!existingUser){
            return res.sendStatus(403);
        }

        merge (req, { identity: existingUser });

        return next()

    } catch (err){
        console.log(err);
        return res.sendStatus(400)
    }
}



