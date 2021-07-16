const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const api = require("./api/api");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(helmet());
app.use(morgan("dev"));

app.use("/api", api);

app.use((req, res, next) => {
  const error = {
    code: 501,
    name: "ROUTE_NOT_IMPLEMENTED",
    message: `${req.method} su ${req.originalUrl} non implementata`,
  };
  next(error);
});

app.use((err, req, res, next) => {
  let error;
  if (!err.code) {
    error = {
      code: 500,
      name: "INTERNAL_SERVER_ERROR",
      message: "Errore interno al server",
    };
  } else if (err.code === "EBADCSRFTOKEN") {
    error = {
      code: 403,
      name: "INVALID_CSRF_TOKEN",
      message: "Richiesta non consentita",
    };
  } else error = err;
  res.status(error.code).json(error);
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
