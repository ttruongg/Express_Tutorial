import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../model/discord-user.js";

passport.serializeUser((user, done) => {
    console.log("Inside SerializeUser");
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {

    try {
        const findUser = await DiscordUser.findById(id);
        return findUser ? done(null, findUser) : done(null, null);
    } catch (error) {
        done(error, null);
    }
});


export default passport.use(new Strategy(
    {
        clientID: '1271410586567049266',
        clientSecret: 'client Secret',
        callbackURL: 'http://localhost:8080/api/auth/discord/redirect',
        scope: ['identify'],

    }, async (accessToken, refreshToken, profile, done) => {
        let findUser;
        findUser = await DiscordUser.findOne({ discordId: profile.id });
        try {
            if (!findUser) {
                const newUser = new DiscordUser({
                    discordId: profile.id,
                    username: profile.username
                })
                const saveUser = await newUser.save();
                return done(null, saveUser);
            }
            return done(null, findUser);
        } catch (error) {
            return done(error, null);
        }
    }));


