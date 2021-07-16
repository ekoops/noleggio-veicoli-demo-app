const express = require("express");
const router = express.Router();
const dao = require("../../db/dao");
const {
  validateId,
  validateProposalData,
  validatePrice,
} = require("../../validators");
const { computePrice } = require("../utils");

/*
GET on /api/rentals
Description:
  This API allows the authenticated user to retrieve
  his own rentals.
URL parameters: no
Request body: empty
Response body: The authenticated user rentals
  type: application/json
  body:
    Rental[]
Error responses: INTERNAL_SERVER_ERROR, GET_RENTALS_FAILED
*/
router.get("/", (req, res, next) => {
  const userId = req.user.id;
  dao
    .getRentals(userId)
    .then((rentals) => res.status(200).json(rentals))
    .catch(next);
});

/*
POST on /api/rentals
Description:
  This API allows the authenticated user to
  create a new rental
URL parameters: no
Request body:
  startDate: string               required
  endDate: string                 required
  category: string                required
  age: number                     required
  additionalDriverNumber: number  required
  expectedKm: number              required
  extraInsurance: boolean         required
  rentalPrice: number             required
Response body: The new created rental id
  type: application/json
  body:
    createdRentalId: number
Error responses: INTERNAL_SERVER_ERROR, INCONSISTENT_PRICE, AVAILABLE_VEHICLE_NOT_FOUND,
CREATE_RENTAL_FAILED
*/
router.post("/", [...validateProposalData, validatePrice], (req, res, next) => {
  const data = {
    userId: req.user.id,
    startDate: Date.parse(req.body.startDate),
    endDate: Date.parse(req.body.endDate),
    category: req.body.category,
    age: req.body.age,
    additionalDriverNumber: req.body.additionalDriverNumber,
    expectedKm: req.body.expectedKm,
    extraInsurance: +req.body.extraInsurance,
    rentalPrice: req.body.rentalPrice,
  };

  computePrice(data)
    .then(([_, rentalPrice]) => {
      if (rentalPrice !== data.rentalPrice) {
        const error = {
          code: 400,
          name: "INCONSISTENT_PRICE",
          message: `Il prezzo comunicato non è compatibile con i parametri della richiesta.`,
        };
        return next(error);
      }
      return dao
        .getAvailableVehicle(data.category, data.startDate, data.endDate)
        .then((vehicleId) =>
          dao
            .createRental(data.userId, vehicleId, data)
            .then((createdRentalId) => {
              res.status(200).json({ createdRentalId });
            })
        );
    })
    .catch(next);
});

/*
DELETE on /api/rentals/{id}
Description:
  This API allows the authenticated user to delete
  his own rental specified through id.
URL parameters:
  {id}: number   required
    a rental identifier (must be positive)
Request body: empty
Response body: The authenticated user deleted rental id
  type: application/json
  body:
    deletedId: number
Error responses: INTERNAL_SERVER_ERROR, DELETE_RENTAL_FAILED
*/
router.delete("/:id", validateId, (req, res, next) => {
  const userId = req.user.id;
  const rentalId = req.params.id;
  dao
    .deleteRental(userId, rentalId)
    .then((deletedRentalId) => res.status(200).json({ deletedRentalId }))
    .catch(next);
});

module.exports = router;
