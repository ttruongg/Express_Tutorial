import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constant.js";
import { User } from "../model/user.js";
import { comparePassword } from "../utils/helper.js";
passport.serializeUser((user, done) => {
    console.log("Inside serializeUser");
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await User.findById(id);
        if (!findUser) throw new Error("User not found");
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }
});

export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const findUser = await User.findOne({ username });
            if (!findUser) throw new Error("User not found");
            if (!(comparePassword(password, findUser.password))) throw new Error("Invalid Credential");
            done(null, findUser);
        } catch (error) {
            done(error, null);

        }
    }))