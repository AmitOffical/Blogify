/*-------Create a function to check the user is loggedIn or Not---------*/
//------And this middleware is use every wehre in our site--------

const { validateToken } = require("../utils/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]
        if (!tokenCookieValue) {
           return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            console.log('Token validate error', error)
        }
       return next();
    };
}

module.exports = {
    checkForAuthenticationCookie
}