const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const vehiclesRoutes = require("./routes/vehicles");
const rentalsRoutes = require("./routes/rentals");
const dao = require("../db/dao");
const {
  validateProposalData,
  validatePaymentData,
  validatePrice,
} = require("../validators");
const { validateJWT, csrfProtection } = require("./security");
const {computePrice} = require("./utils");

const router = express.Router();

/*
GET on /api/brands
Description:
  This API allows to retrieve all brands
URL parameters: no
Request body: empty
Response body: Array of brands
  type: application/json
  body:
    string[]
Error responses: INTERNAL_SERVER_ERROR, GET_BRANDS_FAILED
*/
router.get("/brands", (req, res, next) => {
  dao
    .getBrands()
    .then((brands) => res.status(200).json(brands))
    .catch(next);
});

/*
GET on /api/categories
Description:
  This API allows to retrieve all categories
URL parameters: no
Request body: empty
Response body: Array of categories
  type: application/json
  body:
    string[]
Error responses: INTERNAL_SERVER_ERROR, GET_CATEGORIES_FAILED
*/
router.get("/categories", (req, res, next) => {
  dao
    .getCategories()
    .then((categories) => res.status(200).json(categories))
    .catch(next);
});

router.use("/vehicles", vehiclesRoutes);

router.use(cookieParser());
router.use(express.json());

router.use("/auth", authRoutes);

router.use(validateJWT);
router.use(csrfProtection);

router.use("/rentals", rentalsRoutes);

/*
POST on /api/proposals
Description:
  This API allows the authenticated user to
  retrieve a proposal for rental based on
  the requested parameters
URL parameters: no
Request body:
  startDate: string               required
  endDate: string                 required
  category: string                required
  age: number                     required
  additionalDriverNumber: number  required
  expectedKm: number              required
  extraInsurance: boolean         required
Response body: The new Proposal
  type: application/json
  body:
    numOfAvailableVehicles: number
    rentalPrice: number
Error responses: INTERNAL_SERVER_ERROR,
  GET_N_OF_AVAILABLE_VEHICLES_FAILED,
  NO_AVAILABLE_VEHICLES,
  GET_N_OF_CATEGORY_VEHICLES_FAILED,
  GET_N_OF_USER_RENTAL_FAILED
*/
router.post("/proposals", validateProposalData, (req, res, next) => {
  const data = {
    userId: req.user.id,
    startDate: Date.parse(req.body.startDate),
    endDate: Date.parse(req.body.endDate),
    category: req.body.category,
    age: req.body.age,
    additionalDriverNumber: req.body.additionalDriverNumber,
    expectedKm: req.body.expectedKm,
    extraInsurance: req.body.extraInsurance,
  };

  computePrice(data)
    .then(([numOfAvailableVehicles, rentalPrice]) => {
      res.status(200).json({ numOfAvailableVehicles, rentalPrice });
    })
    .catch(next);
});

/*
POST on /api/payments
Description:
  This dummy API allows the authenticated user to
  pay for a rental request.
URL parameters: no
Request body:
  holderName: string      required
  holderSurname: string   required
  cardID: string          required
  expiryMonth: number     required
  expiryYear: number      required
  CVV: string             required
  rentalPrice: number     required
Response body: Dummy response
  type: application/json
  body:
    message: string
Error responses: INTERNAL_SERVER_ERROR
*/
router.post(
  "/payments",
  [...validatePaymentData, validatePrice],
  (req, res) => {
    res.status(200).json({ message: "ok" });
  }
);

module.exports = router;
