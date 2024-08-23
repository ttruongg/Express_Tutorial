import { getUserById, createUser } from "../controller/user.js";
import validator, { ExpressValidator, matchedData } from "express-validator";
import * as helpers from "../utils/helper.js";
import { User } from "../model/user.js";
jest.mock("express-validator", () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: "Invalid field" }])
    })),
    matchedData: jest.fn(() => ({
        username: "test",
        displayName: "test_name",
        password: "password"
    }))
}));

jest.mock("../utils/helper.js", () => ({
    hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock("../model/user.js");

const mockRequest = {
    findUserIndex: 1,
}

const mockResponse = {
    sendStatus: jest.fn(),
    send: jest.fn(),
    status: jest.fn(() => mockResponse)
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
});

describe("create users", () => {
    const mockRequest = {};
    it("should return status 400 when there are errors", async () => {
        await createUser(mockRequest, mockResponse),
            expect(validator.validationResult).toHaveBeenCalled(),
            expect(validator.validationResult).toHaveBeenCalledWith(mockRequest),
            expect(mockResponse.status).toHaveBeenCalledWith(400),
            expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "Invalid field" }])
    });
    it("should return status 201 and user created", async () => {
        jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true),
        }));
        const saveMethod = jest
            .spyOn(User.prototype, "save")
            .mockResolvedValueOnce({
                id: 1,
                username: "test",
                password: "hashed_password",
                displayName: "test_name",
            });
        await createUser(mockRequest, mockResponse),
            expect(validator.matchedData).toHaveBeenCalledWith(mockRequest),
            expect(helpers.hashPassword).toHaveBeenCalledWith("password"),
            expect(helpers.hashPassword).toHaveReturnedWith("hashed_password"),
            expect(User).toHaveBeenCalledWith({
                username: "test",
                password: "hashed_password",
                displayName: "test_name",
            });

        expect(saveMethod).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith({
            id: 1,
            username: "test",
            password: "hashed_password",
            displayName: "test_name",
        });
    });
    it("send status of 400 when database fails to save user", async () => {
        jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true),
        }));
        const saveMethod = jest
            .spyOn(User.prototype, "save")
            .mockImplementationOnce(() => Promise.reject("Failed to save user"));
        await createUser(mockRequest, mockResponse);
        expect(saveMethod).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    });
})