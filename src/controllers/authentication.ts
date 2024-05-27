import express from 'express';

import { createUser, getUserByEmail } from '../db/users'
import { authentication, random } from '../helpers'

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password){
            return res.sendStatus(400); 
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')
        if (!user){
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash){
            return res.sendStatus(403);
        }

        const salt = random()
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        await user.save()

        res.cookie('STAN-AUTH', user.authentication.sessionToken, {domain: 'localhost', path: '/'})

        return res.status(200).json(user).end()

    } catch (err){
        console.log(`Login Error: ${err}`);
        return res.sendStatus(400);
    }
}

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