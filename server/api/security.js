const jwt = require("jsonwebtoken");
const csurf = require("csurf");

const secretKey =
  "aTI0rCMVgOsQNX4PU2XuOYhpp5ZDaAMDhzNBNKxDagRH7r6cNKXwPeaJo8zspsz6";
const jwtOptions = {
  expiresIn: 600, // 10 minutes
};

const createJWTFailedError = {
  code: 500,
    name: "AUTH_FAILED",
  message: "Autenticazione fallita.",
}

const createJWT = async (user) => {
  const payload = { id: user.id };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, jwtOptions, (err, token) => {
      if (err) reject(createJWTFailedError);
      else resolve({ token, expiresIn: jwtOptions.expiresIn });
    });
  });
};

// Middleware Utilizzato in sostituzione di express-jwt per
// consentire di gestire i token non validi nel middleware stesso
const validateJWT = (req, res, next) => {
  jwt.verify(req.cookies.token, secretKey, (err, payload) => {
    if (err) {
      const error = {
        code: 401,
        name: "UNAUTHORIZED",
        message: "Non autorizzato.",
      };
      return next(error);
    } else req.user = payload;
    next();
  });
};

const csrfProtection = csurf({
  cookie: { httpOnly: true, sameSite: true },
});

module.exports = { createJWT, validateJWT, csrfProtection };
