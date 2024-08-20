import { getUserById } from "../controller/user.js";

const mockRequest = {
    findUserIndex: 1,
}

const mockResponse = {
    sendStatus: jest.fn(),
    send: jest.fn()
}

describe("get user by id", () => {
    it("return a user by id", () => {
        getUserById(mockRequest, mockResponse);
        expect(mockResponse.send).toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith({
            id: 2,
            username: "anson",
            displayName: "Anson",
            password: "hello124"
        });
        expect(mockResponse.send).toHaveBeenCalledTimes(1);
    });
    it("return user not found with 404", () => {
        const copyMockRequest = { ...mockRequest, findUserIndex: 100 };
        getUserById(copyMockRequest, mockResponse);
        expect(mockResponse.sendStatus).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
        expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);


    })
})