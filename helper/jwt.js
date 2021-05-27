const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.api;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    //unless is used to exclude some APIs (i.e user can access these routes without authorization)
    path: [
      {
        //regex .* indicates everything after products
        url: /\/api\/v1\/products(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/categories(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      `/api/v1/users/login`,
      `/api/v1/users/register`,
    ],
  });
}

//This function is used to differentiate between user and admin
async function isRevoked(req, payload, done) {
  //here in function parameter payload used to access the data inside the token(i.e. isAdmin and userId)
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}

module.exports = authJwt;
