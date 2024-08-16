import { mockUsers } from "../utils/constant.js";

export function getUserById(request, response) {
    const { findUserIndex } = request;
    const user = mockUsers[findUserIndex];

    if (!user) {
        return response.status(404).send("User not found! ");
    }

    return response.send(user);
}