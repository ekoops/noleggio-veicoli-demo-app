const express = require("express");
const router = express.Router();
const dao = require("../../db/dao");
const {validateId} = require("../../validators");

/*
GET on /api/vehicles[?[brands={brands}]&[categories={categories}]]
Description:
  This API allows to retrieve all vehicles,
  optionally filtered by categories and brands
Query string parameters:
  {brands}: string      optional
    a commma separated list of brands name
  {categories}: string  optional
    a comma separated list of categories name
Request body: empty
Response body: Array of vehicles
  type: application/json
  body:
    Vehicle[]
Error responses: INTERNAL_SERVER_ERROR, GET_VEHICLES_FAILED
*/
router.get("/", (req, res, next) => {
  const brands = (req.query.brands && req.query.brands.split(",")) || [];
  const categories = (req.query.categories &&
    req.query.categories.split(",")) || [];

  dao
    .getVehicles(brands, categories)
    .then((vehicles) => res.status(200).json(vehicles))
    .catch(next);
});

/*
GET on /api/vehicles/{id}
Description:
  This API allows to retrieve the vehicle
  identified by the provided id
URL parameters:
  {id}: number    required
    a vehicle identifier (must be positive)
Request body: empty
Response body: The requested vehicle
  type: application/json
  body:
    Vehicle
Error responses: INTERNAL_SERVER_ERROR, VEHICLE_NOT_FOUND
*/
router.get("/:id", validateId, (req, res, next) => {
  const vehicleId = req.params.id;

  dao.getVehicle(vehicleId).then((vehicle) => {
    res.status(200).json(vehicle);
  }).catch(next)
});

module.exports = router;
