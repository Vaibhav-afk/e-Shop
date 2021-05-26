const expressJwt = require("express-jwt");

function authJwt(){
    const secret = process.env.secret;
    const api = process.env.api;
    return expressJwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        //unless is used to exclude some APIs (i.e user can access these routes without authorization)
        path: [
            {
                //regex .* indicates everything after products
                url: /\/api\/v1\/products(.*)/,
                methods: ['GET','OPTIONS']
            },
            {
                url: /\/api\/v1\/categories(.*)/,
                methods: ['GET','OPTIONS']
            },
            `/${api}/users/login`,
            `/${api}/users/register`,
        ]
    });
}
module.exports = authJwt; 