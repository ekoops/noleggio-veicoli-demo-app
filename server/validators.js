const { param, body, validationResult } = require("express-validator");

const formatError = (errors) => {
  return {
    code: 400,
    name: "INVALID_FIELDS",
    messages: errors
      .array()
      .map((err) => ({ field: err.param, message: err.msg })),
  };
};

const checkErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = formatError(validationErrors);
    return next(error);
  } else return next();
};

const validateLoginData = [
  body("email")
    .isString()
    .withMessage("Il campo email deve contenere una stringa")
    .bail()
    .isEmail()
    .withMessage("Il campo email deve contenere un indirizzo email valido"),
  body("password")
    .isString()
    .withMessage("Il campo password deve contenere una stringa")
    .bail()
    .custom((password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,20}$/;
      if (!passwordRegex.test(password)) {
        throw new Error(
          "Il campo password deve contenere una stringa lunga tra i 4 ed i 20" +
            " caratteri con almeno una lettera maiuscola, una lettera minuscola" +
            " ed uno dei seguenti simboli: @$!%*?&"
        );
      } else return true;
    }),
];

const validateId = [
  param("id")
    .isInt({ min: 0 })
    .withMessage("L'id deve essere un numero maggiore o uguale a 0"),
];

const validateProposalData = [
  body("startDate").custom((value) => {
    const date = Date.parse(value);
    if (isNaN(date) || date < Date.now()) {
      throw new Error(
        "Il campo data di inizio noleggio deve contenere una data valida nel futuro"
      );
    } else return true;
  }),
  body("endDate").custom((value, { req }) => {
    const date = Date.parse(value);
    if (isNaN(date) || date <= Date.parse(req.body.startDate)) {
      throw new Error(
        "Il campo data di fine noleggio deve contenere una data valida successiva alla data di fine"
      );
    } else return true;
  }),
  body("category")
    .isString()
    .withMessage("Il campo categoria deve contenere una stringa"),
  body("age")
    .isInt({ min: 18, max: 80 })
    .withMessage(
      "Il campo età deve contenere un valore numerico compreso tra 18 e 80"
    ),
  body("additionalDriverNumber")
    .isInt({ min: 0, max: 4 })
    .withMessage(
      "Il campo numero di guidatori addizionali deve contenere un valore numerico compreso tra 0 e 4"
    ),
  body("expectedKm")
    .isInt({ min: 15 })
    .withMessage(
      "Il campo numero di kilometri stimati deve contenere un valore maggiore o uguale a 15"
    ),
  body("extraInsurance")
    .isBoolean()
    .withMessage(
      "il campo assicurazione extra deve contenere un valore booleano"
    ),
];

const validatePrice = body("rentalPrice")
  .isFloat({ min: 0 })
  .withMessage("Il prezzo deve essere un numero con virgola positivo ");

const validatePaymentData = [
  body("holderName")
    .isString()
    .withMessage("Il campo nome dell'intestatario deve contenere una stringa")
    .bail()
    .custom((holderName) => {
      const holderNameRegex = /^[A-Za-z\s]{4,20}$/;
      if (!holderNameRegex.test(holderName)) {
        throw new Error(
          "Il campo nome dell'intestatario deve contenere una stringa lunga tra i 4 ed i 20" +
            " dove possono essere presenti caratteri (maiuscoli e minuscoli) e spazi"
        );
      } else return true;
    }),
  body("holderSurname")
    .isString()
    .withMessage(
      "Il campo cognome dell'intestatario deve contenere una stringa"
    )
    .bail()
    .custom((holderSurname) => {
      const holderSurnameRegex = /^[A-Za-z\s]{4,20}$/;
      if (!holderSurnameRegex.test(holderSurname)) {
        throw new Error(
          "Il campo cognome dell'intestatario deve contenere una stringa lunga tra i 4 ed i 20" +
            " dove possono essere presenti caratteri (maiuscoli e minuscoli) e spazi"
        );
      } else return true;
    }),
  body("cardID")
    .isString()
    .withMessage("Il campo numero della carta deve contenere una stringa")
    .bail()
    .custom((cardID) => {
      const cardIDRegex = /^\d{13}$/;
      if (!cardIDRegex.test(cardID)) {
        throw new Error("Il campo numero della carta deve contenere 13 cifre");
      } else return true;
    }),
  body("expiryMonth")
    .isInt({ min: 1, max: 12 })
    .withMessage(
      "Il campo mese di scadenza deve contenere un numero compreso tra 1 e 12"
    )
    .bail()
    .custom((expiryMonth, { req }) => {
      const today = new Date(new Date().toISOString().slice(0, 10));
      const minYear = today.getFullYear();
      const minMonth = today.getMonth() + 1;

      const expiryYear = parseInt(req.body.expiryYear);
      if (isNaN(expiryYear))
        throw new Error("Il campo anno di scadenza deve contenere un numero");
      if (expiryYear === minYear && expiryMonth < minMonth)
        throw new Error("Il campo mese di scadenza è nel passato");
      else return true;
    }),
  body("expiryYear")
    .isInt({
      min: new Date(new Date().toISOString().slice(0, 10)).getFullYear(),
      max: 2100,
    })
    .bail(),
  body("CVV")
    .isString()
    .withMessage("Il campo CVV deve contenere una stringa")
    .bail()
    .custom((CVV) => {
      const CVVRegex = /^\d{3}$/;
      if (!CVVRegex.test(CVV)) {
        throw new Error("Il campo CVV deve contenere 3 cifre");
      } else return true;
    }),
];

module.exports = {
  checkErrors,
  validateLoginData,
  validateId,
  validateProposalData,
  validatePrice,
  validatePaymentData,
};
