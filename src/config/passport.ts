import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './db.js';
import { env } from './env.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('--- Received Google Profile ---');
            console.log(JSON.stringify(profile, null, 2));
            try {
                const email = profile.emails?.find((e) => e.verified)?.value;

                if (!email) {
                    return done(
                        new Error('No verified email found in Google profile'),
                        undefined
                    );
                }

                let user = await prisma.user.findUnique({ where: { email } });

                if (!user) {
                    const username = profile.displayName || email.split('@')[0];

                    user = await prisma.user.create({
                        data: {
                            email: email,
                            username: profile.displayName,
                            password: Math.random().toString(36).slice(-8),
                        },
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);
