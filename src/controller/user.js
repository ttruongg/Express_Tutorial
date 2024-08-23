import { mockUsers } from "../utils/constant.js";
import { User } from "../model/user.js";
import { hashPassword } from "../utils/helper.js";
import { matchedData, validationResult } from "express-validator";
export function getUserById(request, response) {
    const { findUserIndex } = request;
    const user = mockUsers[findUserIndex];

    if (!user) {
        return response.sendStatus(404);
    }

    return response.send(user);
};

export const createUser = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());
    const data = matchedData(req);
    data.password = hashPassword(data.password);
    const newUser = new User(data);

    try {
        const saveUser = await newUser.save();
        return res.status(201).send(saveUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};