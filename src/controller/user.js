import { mockUsers } from "../utils/constant.js";

export function getUserById(request, response) {
    const { findUserIndex } = request;
    const user = mockUsers[findUserIndex];

    if (!user) {
        return response.sendStatus(404);
    }

    return response.send(user);
}