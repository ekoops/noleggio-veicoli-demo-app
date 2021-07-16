const express = require("express");
const router = express.Router();
const dao = require("../../db/dao");
const { createJWT, validateJWT, csrfProtection } = require("../security");
const { validateLoginData, checkErrors } = require("../../validators");

/*
POST on /api/auth/login
Description:
  This API allows the client to authenticate by providing
  email and password. The authentication is made by setting
  a JWT as a cookie.
URL parameters: no
Request body:
  email: string     required
  password: string  required
Response body: The authenticated user info
  type: application/json
  body:
    User
Error responses: INTERNAL_SERVER_ERROR, UNAUTHORIZED, AUTH_FAILED
*/
router.post("/login", validateLoginData, checkErrors, (req, res, next) => {
  const { email, password } = req.body;
  dao
    .checkUserPassword(email, password)
    .then((user) =>
      createJWT(user).then(({ token, expiresIn }) => {
        res.cookie("token", token, {
          httpOnly: true, // to prevent cookie manipulation from scripts
          sameSite: true, // to prevent cross-origin cookie sending
          maxAge: expiresIn * 1000,
        });
        res.status(200).json(user);
      })
    )
    .catch((error) => {
      if (error.code === 401) {
        setTimeout(() => next(error), 2000);
      } else next(error);
    });
});

/*
POST on /api/auth/logout
Description:
  This API allows the client to deauthenticate.
  The deauthentication is made by clearing the JWT cookie.
URL parameters: no
Request body: empty
Response body: empty
Error responses: INTERNAL_SERVER_ERROR
*/
router.post("/logout", (req, res) => {
  res.clearCookie("token").end();
});

router.use(validateJWT);

/*
GET on /api/auth/csrf-token
Description:
  This API allows to retrieve the csrf token nedeed to
  allow the authenticated client to submit protected requests
URL parameters: no
Request body: empty
Response body: The csrf token
  type: application/json
  body:
    csrfToken: string
Error responses: INTERNAL_SERVER_ERROR
*/
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

/*
GET on /api/auth/user
Description:
  This API allows to retrieve the own account info
  for an authenticated user.
URL parameters: no
Request body: empty
Response body: The authenticated user info
  type: application/json
  body:
    User
Error responses: INTERNAL_SERVER_ERROR, USER_NOT_FOUND
*/
router.get("/user", (req, res, next) => {
  dao.getUserInfo(req.user.id).then(user => res.status(200).json(user)).catch(next);
});

module.exports = router;
