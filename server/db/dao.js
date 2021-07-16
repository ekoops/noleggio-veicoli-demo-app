const db = require("./db");
const bcrypt = require("bcrypt");
const Vehicle = require("../model/Vehicle");
const User = require("../model/User");
const Rental = require("../model/Rental");

const userNotFoundError = {
  code: 404,
  name: "USER_NOT_FOUND",
  message: "Non è stato possibile trovare l'utente richiesto",
};

const getUserInfo = (userId) => {
  const query = `SELECT id, email FROM user WHERE id=?`;

  return new Promise((resolve, reject) => {
    db.get(query, [userId], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(userNotFoundError);
      const user = User.fromObj(row);
      resolve(user);
    });
  });
};

const authenticationFailedError = {
  code: 401,
  name: "UNAUTHORIZED",
  message:
    "Non è stato possibile effettuare l'accesso con le credenziali fornite.",
};

const checkUserPassword = (email, password) => {
  const query = `SELECT * FROM user WHERE email=?`;

  return new Promise((resolve, reject) => {
    db.get(query, [email], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(authenticationFailedError);
      // utente trovato... provo a confrontare la password fornita con l'originale
      bcrypt.compare(password, row.password, (err, result) => {
        // errore interno generico gestito altrove
        if (err) return reject(err);
        if (!result) return reject(authenticationFailedError);
        // autenticazione andata a buon fine

        const user = User.fromObj(row);
        resolve(user);
      });
    });
  });
};

const getBrandsFailedError = {
  code: 500,
  name: "GET_BRANDS_FAILED",
  message: "Non è stato possibile ottenere le marche disponibili",
};

const getBrands = () => {
  const query = "SELECT DISTINCT brand FROM vehicle ORDER BY brand";

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(getBrandsFailedError);
      else {
        const brands = rows.map((row) => row.brand);
        resolve(brands);
      }
    });
  });
};

const getCategoriesFailedError = {
  code: 500,
  name: "GET_CATEGORIES_FAILED",
  message: "Non è stato possibile ottenere le categorie disponibili",
};

const getCategories = () => {
  const query = "SELECT DISTINCT category FROM vehicle ORDER BY category";

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(getCategoriesFailedError);
      else {
        const categories = rows.map((row) => row.category);
        resolve(categories);
      }
    });
  });
};

const vehicleNotFoundError = (vehicleId) => ({
  code: 500,
  name: "VEHICLE_NOT_FOUND",
  message: `Non è stato possibile trovare il veicolo con id: ${vehicleId}`,
});

const getVehicle = (vehicleId) => {
  const query = "SELECT * FROM vehicle WHERE id = ?";

  return new Promise((resolve, reject) => {
    db.get(query, [vehicleId], (err, vehicle) => {
      if (err) return reject(err);
      if (!vehicle) return reject(vehicleNotFoundError(vehicleId));
      resolve(vehicle);
    });
  });
};

const getVehiclesFailedError = {
  code: 500,
  name: "GET_VEHICLES_FAILED",
  message: "Non è stato possibile ottenere i veicoli disponibili",
};

const getVehicles = (brands, categories) => {
  let query = "SELECT * FROM vehicle";
  if (brands.length || categories.length) {
    query += " WHERE ";
    const brandsQueryString = Array(brands.length)
      .fill("brand = ?")
      .join(" OR ");
    const categoriesQueryString = Array(categories.length)
      .fill("category = ?")
      .join(" OR ");
    if (brandsQueryString) query += " ( " + brandsQueryString + " ) ";
    if (categoriesQueryString) {
      if (brandsQueryString) query += " AND ";
      query += " ( " + categoriesQueryString + " ) ";
    }
  }

  return new Promise((resolve, reject) => {
    db.all(query, brands.concat(categories), (err, rows) => {
      if (err) return reject(getVehiclesFailedError);
      const vehicles = rows.map(Vehicle.fromObj);
      resolve(vehicles);
    });
  });
};

const getNOfAvailableVehiclesFailedError = {
  code: 500,
  name: "GET_N_OF_AVAILABLE_VEHICLES_FAILED",
  message:
    "Non è stato possibile ottenere il numero di veicoli disponibili per il noleggio",
};
const noAvailableVehiclesError = {
  code: 500,
  name: "NO_AVAILABLE_VEHICLES",
  message:
    "Non ci sono veicoli disponibili per il noleggio con le caratteristiche richieste",
};

const getNumOfAvailableVehicles = (category, endDate, startDate) => {
  const query = `SELECT COUNT(*) AS numOfAvailableVehicles
     FROM vehicle V
     WHERE V.category = ? AND
        V.id NOT IN (
            SELECT R.refVehicle
            FROM rental R
            WHERE R.endDate >= ? AND R.startDate <= ?
        )`;
  const queryParams = [category, startDate, endDate];

  return new Promise((resolve, reject) => {
    db.get(query, queryParams, (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(getNOfAvailableVehiclesFailedError);
      if (row.numOfAvailableVehicles === 0)
        return reject(noAvailableVehiclesError);
      resolve(row.numOfAvailableVehicles);
    });
  });
};

const getNOfCategoryVehiclesFailedError = (category) => ({
  code: 500,
  name: "GET_N_OF_CATEGORY_VEHICLES_FAILED",
  message: `Non è stato possibile ottenere il numero di veicoli la categoria ${category}`,
});

const getNumOfCategoryVehicles = (category) => {
  const query = `SELECT COUNT(*) AS numOfCategoryVehicles
     FROM vehicle
     WHERE category = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [category], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(getNOfCategoryVehiclesFailedError(category));
      resolve(row.numOfCategoryVehicles);
    });
  });
};

const getNOfUserRentalFailedError = (userId) => ({
  code: 500,
  name: "GET_N_OF_USER_RENTAL_FAILED",
  message: `Non è stato possibile ottenere il numero di noleggi dell'utente ${userId}`,
});

const getNumOfUserRental = (userId) => {
  const date = new Date(new Date().toISOString().slice(0, 10)).getTime();
  const query = `SELECT COUNT(*) AS numOfUserRental
     FROM rental
     WHERE refUser = ? AND endDate < ?`;


  return new Promise((resolve, reject) => {
    db.get(query, [userId, date], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(getNOfUserRentalFailedError(userId));
      else resolve(row.numOfUserRental);
    });
  });
};

const getRentalsFailedError = {
  code: 500,
  name: "GET_RENTALS_FAILED",
  message: "Non è stato possibile ottenere i noleggi",
};

const getRentals = (userId) => {
  const query = "SELECT * FROM rental where refUser = ?";

  return new Promise((resolve, reject) => {
    db.all(query, userId, (err, rows) => {
      if (err) return reject(getRentalsFailedError);
      const rentals = rows.map(Rental.fromObj);
      resolve(rentals);
    });
  });
};

const availableVehicleNotFoundError = {
  code: 500,
  name: "AVAILABLE_VEHICLE_NOT_FOUND",
  message:
    "Non è stato possibile ottenere un veicolo disponibile per il noleggio",
};

const getAvailableVehicle = (category, startDate, endDate) => {
  // trovo un veicolo libero
  const query = `SELECT id
     FROM vehicle V
     WHERE V.category = ? AND
        V.id NOT IN (
            SELECT R.refVehicle
            FROM rental R
            WHERE R.endDate >= ? AND R.startDate <= ?
         )`;

  const queryParams = [category, startDate, endDate];

  return new Promise((resolve, reject) => {
    db.get(query, queryParams, (err, row) => {
      if (err) return reject(err);
      if (!row) reject(availableVehicleNotFoundError);
      else resolve(row.id);
    });
  });
};

const createRentalFailedError = {
  code: 500,
  name: "CREATE_RENTAL_FAILED",
  message: "Non è stato possibile creare il noleggio",
};

const createRental = (userId, vehicleId, data) => {
  const query = `INSERT INTO rental(refUser, refVehicle,
    startDate, endDate, age, expectedKm,
    extraInsurance, additionalDriverNumber,
    rentalPrice) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const queryParams = [
    userId,
    vehicleId,
    data.startDate,
    data.endDate,
    data.age,
    data.expectedKm,
    data.extraInsurance,
    data.additionalDriverNumber,
    data.rentalPrice,
  ];
  return new Promise((resolve, reject) => {
    db.run(query, queryParams, function (err) {
      if (err) reject(createRentalFailedError);
      else resolve(this.changes);
    });
  });
};

const deleteRentalFailedError = (rentalId) => ({
  code: 500,
  name: "DELETE_RENTAL_FAILED",
  message: `Non è stato possibile eliminare il noleggio con l'id: ${rentalId}`,
});

const deleteRental = (userId, rentalId) => {
  const date = new Date(new Date().toISOString().slice(0, 10)).getTime();
  const query =
    "DELETE FROM rental WHERE id=? AND refUser = ? AND startDate > ?";

  return new Promise((resolve, reject) => {
    db.run(query, [rentalId, userId, date], function (err) {
      if (err) reject(deleteRentalFailedError(rentalId));
      else resolve(this.changes);
    });
  });
};

module.exports = {
  getUserInfo,
  checkUserPassword,
  getBrands,
  getCategories,
  getVehicle,
  getVehicles,
  getNumOfAvailableVehicles,
  getNumOfCategoryVehicles,
  getNumOfUserRental,
  getRentals,
  createRental,
  deleteRental,
  getAvailableVehicle,
};
