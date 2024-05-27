import express from 'express';

import { createUser, getUserByEmail } from '../db/users'
import { authentication, random } from '../helpers'

export const register = async (req: express.Request, res: express.Response) => {
    try {

        const { email, password, username} = req.body;

        // if input info missing
        if (!email || !password || !username ){
            console.log('Missing email, password, or username');
            return res.status(400).json({ error: 'Missing email, password, or username' });
        }
        // if user exist
        const existingUser = await getUserByEmail(email) 
        if (existingUser){
            return res.sendStatus(400)
        }

        // crete user
        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })
        return res.status(200).json(user)


    } catch (error) {
        console.log(`Error: ${error}`);
        return res.sendStatus(500);
    }
}