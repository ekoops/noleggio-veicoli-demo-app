import axios from "axios";
import Message from "../model/Message";
import Vehicle from "../model/Vehicle";
import User from "../model/User";
import Rental from "../model/Rental";

const BASE_URL = "http://localhost:3000/api";

const errorHandler = (err, header) => {
  const data = err.response.data;

  let messages;
  // se è un errore mandato dal server ha la proprietà code impostata...
  if (data.code) {
    messages = data.message
      ? [data.message]
      : data.messages.map((e) => e.message);
  } else messages = ["Impossibile contattare il server"];

  const error = { header, messages };
  return Promise.reject(error);
};

// Non gestisco la presenza di un errore perchè questa richiesta
// può essere solo subordinata ad un altra richiesta di questo modulo
const getVehicle = (vehicleId, csrfToken) => {
  return axios
    .get(`${BASE_URL}/vehicles/${vehicleId}`, {
      headers: { "X-CSRF-Token": csrfToken },
    })
    .then(({ data }) => data);
};

const getVehicles = ({ brands, categories }) => {
  const brandNames = Object.keys(brands);
  const brandsString = brandNames.some(
    (brandName) => brands[brandName] === false
  )
    ? brandNames.filter((brandName) => brands[brandName] === true).join(",")
    : "";

  const categoryNames = Object.keys(categories);
  const categoriesString = categoryNames.some(
    (categoryName) => categories[categoryName] === false
  )
    ? categoryNames
        .filter((categoryName) => categories[categoryName] === true)
        .join(",")
    : "";

  let queryString = "";
  if (brandsString || categoriesString) {
    queryString += "?";
    if (brandsString) {
      queryString += `brands=${brandsString}`;
    }
    if (categoriesString) {
      if (queryString !== "?") queryString += "&";
      queryString += `categories=${categoriesString}`;
    }
  }
  return axios
    .get(`${BASE_URL}/vehicles${queryString}`)
    .then(({ data }) => data.map(Vehicle.fromObj))
    .catch((error) =>
      errorHandler(error, "Errore nel caricamento dei veicoli")
    );
};

const getAllBrands = () => {
  return axios
    .get(`${BASE_URL}/brands`)
    .then(({ data }) => {
      let brands = {};
      data.forEach((brandName) => (brands[brandName] = false));
      return brands;
    })
    .catch((error) =>
      errorHandler(error, "Errore nel caricamento delle marche disponibili")
    );
};

const getAllCategories = () => {
  return axios
    .get(`${BASE_URL}/categories`)
    .then(({ data }) => {
      let categories = {};
      data.forEach((categoryName) => (categories[categoryName] = false));
      return categories;
    })
    .catch((error) =>
      errorHandler(error, "Errore nel caricamento delle categorie")
    );
};

const login = (credentials) => {
  return axios
    .post(`${BASE_URL}/auth/login`, credentials)
    .then(({ data }) =>
      getCsrfToken().then((csrfToken) => ({ user: data, csrfToken }))
    )
    .catch((error) => errorHandler(error, "Autenticazione fallita!"));
};

// Non gestisco la catch perchè un'eventuale errore viene intercettato
// dalle altre richieste che utilizzano la getCsrfToken internamente
// a questo modulo
const getCsrfToken = () => {
  return axios
    .get(`${BASE_URL}/auth/csrf-token`)
    .then(({ data }) => data.csrfToken);
};

const logout = () => {
  return axios
    .post(`${BASE_URL}/auth/logout`)
    .then(() => true) // ritorno un valore a caso, non verrà utilizzato
    .catch((error) => errorHandler(error, "Impossibile effettuare il logout"));
};

const getUserInfo = () => {
  return axios
    .get(`${BASE_URL}/auth/user`)
    .then(({ data }) =>
      getCsrfToken().then((csrfToken) => ({
        user: User.fromObj(data),
        csrfToken,
      }))
    )
    .catch(() => Promise.resolve({}));
};

const getProposal = (proposalParams, csrfToken) => {
  return axios
    .post(`${BASE_URL}/proposals`, proposalParams, {
      headers: { "X-CSRF-Token": csrfToken },
    })
    .then(({ data }) => data)
    .catch((error) => errorHandler(error, "C'è stato un problema!"));
};

const getRentals = (csrfToken) => {
  return axios
    .get(`${BASE_URL}/rentals`, { headers: { "X-CSRF-Token": csrfToken } })
    .then(({ data }) => {
      const promises = data.map((rental) => getVehicle(rental.refVehicle));
      return Promise.all(promises).then((responses) => {
        let rentals = [];
        data.forEach((rental, index) => {
          rentals.push(
            Rental.fromObj({
              id: rental.id,
              startDate: rental.startDate,
              endDate: rental.endDate,
              model: responses[index].model,
              category: responses[index].category,
              brand: responses[index].brand,
              rentalPrice: rental.rentalPrice,
            })
          );
        });
        return rentals;
      });
    })
    .catch((error) => errorHandler(error, "Errore!"));
};

const deleteRental = (rentalId, csrfToken) => {
  return axios
    .delete(`${BASE_URL}/rentals/${rentalId}`, {
      headers: { "X-CSRF-Token": csrfToken },
    })
    .then(
      () =>
        new Message("Eliminazione andata a buon fine", [
          `Noleggio #${rentalId} eliminato correttamente`,
        ])
    )
    .catch((error) => errorHandler(error, "Eliminazione fallita!"));
};

const submitPayment = (data, csrfToken) => {
  return axios
    .post(`${BASE_URL}/payments`, data, {
      headers: { "X-CSRF-Token": csrfToken },
    })
    .then(({ data }) => data.message === "ok")
    .catch((error) => errorHandler(error, "Errore dal server!"));
};

const createRental = (data, csrfToken) => {
  return axios
    .post(`${BASE_URL}/rentals/`, data, {
      headers: { "X-CSRF-Token": csrfToken },
    })
    .catch((error) => errorHandler(error, "Errore dal server!"));
};

export default {
  getVehicles,
  getAllBrands,
  getAllCategories,
  login,
  logout,
  getUserInfo,
  getProposal,
  getRentals,
  deleteRental,
  createRental,
  submitPayment,
};
