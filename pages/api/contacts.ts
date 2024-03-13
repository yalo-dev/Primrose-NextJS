import type { NextApiRequest, NextApiResponse } from 'next'
import passport from 'passport'
import passportAzureAd from 'passport-azure-ad'

const authConfig = {
    credentials: {
        tenantID: process.env.AZURE_APP_TENANT_ID,
        clientID: process.env.AZURE_APP_CLIENT_ID
    },
    metadata: {
        authority: "login.microsoftonline.com",
        discovery: ".well-known/openid-configuration",
        version: "v2.0"
    },
    settings: {
        validateIssuer: true,
        passReqToCallback: true,
        loggingLevel: "info",
        loggingNoPII: true,
    }
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if ( req.method === "GET") {
        console.log(req)
        passport.initialize()
        passport.authenticate(
            new passportAzureAd.BearerStrategy(
                {
                    identityMetadata: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}/${authConfig.metadata.discovery}`,
                    issuer: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}`,
                    clientID: authConfig.credentials.clientID,
                    audience: authConfig.credentials.clientID, // audience is this application
                    validateIssuer: authConfig.settings.validateIssuer,
                    passReqToCallback: authConfig.settings.passReqToCallback,
                }, (req, token, done) => {
                    return done(null, {}, token);
                }
            ),
            {
                session: false,
            },
            (err, user, info) => {
                if (err) {
                    return res.status(401).json({ error: err.message });
                }

                if (!user) {
                    // If no user object found, send a 401 response.
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                if (info) {
                    // access token payload will be available in req.authInfo downstream
                    // req.authInfo = info;
                    const contact_data = {}
                    return res.status(200).json(contact_data)
                }
            })(req, res)
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}