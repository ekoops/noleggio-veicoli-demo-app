# Demo application for a web application exam: "Noleggio veicoli"
This is a reload of an old web app that I developed using React and ExpressJS for
a web application exam.

## React client application routes

- Route `/`:
  - allows the unauthenticated user to access the application vehicles list and filter them. 
  - allows the authenticated user to access the configurator form in order to create a new rental.
- Route `/login`:  allows the unauthenticated user to access a form containing the email and password field for the login procedure.  
- Route `/rentals`: allows the authenticated user to access a page containing lists of past and future rentals.

## REST API server
- GET `/api/brands`
  - Request parameters: none
  - Response body: array of all brand names
  - Error responses: `INTERNAL_SERVER_ERROR`, `GET_BRANDS_FAILED`
- GET `/api/categories`
  - Request parameters: none
  - Response body: array of all category names
  - Error responses: `INTERNAL_SERVER_ERROR`, `GET_CATEGORIES_FAILED`
- GET `/api/vehicles[?[brands=brandList]&[categories=categoryList]]`
  - Request parameters: an optional comma-separated list of brands (`brandList`)
  and/or an optional comma-separated list of categories (`categoryList`)
  - Response body: array of vehicle objects (optionally filtered by brands and categories)
  - Error responses: ``INTERNAL_SERVER_ERROR``, `GET_VEHICLES_FAILED`
- GET `/api/vehicles/:id`
  - Request parameters: the requested vehicle id
  - Response body: an object containing id, brand, category and model of the requested vehicle
  - Error responses: `INTERNAL_SERVER_ERROR`, `VEHICLE_NOT_FOUND`
- POST `api/auth/login`
  - Request body: an object containing `email` and `password` for authentication
  - Response body: an object containing `id` and `email` of the authenticated user
  - Error responses: `INTERNAL_SERVER_ERROR`, `UNAUTHORIZED`, `AUTH_FAILED`
- POST `api/auth/logout`
  - Request body: empty
  - Response body: empty
  - Error responses: `INTERNAL_SERVER_ERROR`
- GET `/api/auth/csrf-token`
  - Request parameters: none
  - Response body: an object containing `csrfToken` for csrf protection
  - Error responses: `INTERNAL_SERVER_ERROR`
- GET `/api/auth/user`
  - Request parameters: none
  - Response body: an object containing `id` and `email` of the user previously authenticated user
  - Error responses: `INTERNAL_SERVER_ERROR`, `USER_NOT_FOUND`
- GET `/api/rentals`
  - Request parameters: none
  - Response body: an array of all user rentals
  - Error responses: `INTERNAL_SERVER_ERROR`, `GET_RENTALS_FAILED`
- POST `/api/rentals`
  - Request body: an object containing `startDate`(string), `endDate`(string) `category`(string),
  `age`(number), `additionalDriverNumber`(number), `expectedKm`(number), `extraInsurance`(boolean), `rentalPrice`(number)
  - Response body: an object containing `createdRentalId` (created rental id) 
  - Error responses: `INTERNAL_SERVER_ERROR`, `INCONSISTENT_PRICE`, `AVAILABLE_VEHICLE_NOT_FOUND`, `CREATE_RENTAL_FAILED`
- DELETE `/api/rentals/:id`
  - Request parameters: the id of the rental to delete
  - Response body: an object containing `deletedRentalId` (deleted rental id)
  - Error responses: `INTERNAL_SERVER_ERROR`, DELETE_RENTAL_FAILED
- POST `/api/proposals`
  - Request body: an object containing `startDate`(string), `endDate`(string) `category`(string),
  `age`(number), `additionalDriverNumber`(number), `expectedKm`(number), `extraInsurance`(boolean)
  - Response body: an object containing `numOfAvailableVehicles` (the number of available vehicles) and `rentalPrice`
  (rental price) for the provided parameters
  - Error responses: `INTERNAL_SERVER_ERROR`, `GET_N_OF_AVAILABLE_VEHICLES_FAILED`, `NO_AVAILABLE_VEHICLES`,
     `GET_N_OF_CATEGORY_VEHICLES_FAILED`, `GET_N_OF_USER_RENTAL_FAILED`,
- POST `/api/payments`
  - Request body: an object containing `holderName`(string), `holderSurname`(string), `cardID`(string),
  `expiryMonth`(number), `expiryYear`(number), `CVV`(string) `rentalPrice`(number) for the payment
  - Response body: an object containing `message` (a dummy message)
  - Error responses: `INTERNAL_SERVER_ERROR`
  
## Server database

- Table `vehicle` - contains information about all the vehicles managed by the application (`id`, `brand`, `category` and `model` for each vehicle)
- Table `user` - contains information about all the application users (`id`, `email`, `password` (hashed password) for each user) 
- Table `rental` - contains information about all the users rentals (`id`, `refUser`, `refVehicle`, `startDate`, `endDate`, `age`, `expectedKm`, `extraInsurance`, `additionalDriverNumber`, `rentalPrice` for each rental)

## Main React Components

- `VehiclesSection` - it shows the vehicles list and allows to filter it by categories and brands  
- `LoginSection` - it shows the login form and allows the user to submit the login request for authentication
- `ConfiguratorSection` - it shows the configurator form and the proposal from the server for the specified parameters.
It allows to customize the requested rental and to finalize it after the payment.
- `RentalsSection` - it shows the lists of past and future user rentals. It allows to delete the future rentals
- `AlertMessage` - it is a generic component used throughout the application. It allows to show error, info or success message.
- `FormElement` - it is the building block of all the forms that require validations. It combines the features of
react-bootstrap components with the formik components 

## Test users

* email@email.com, Email1@ (frequent customer)
* info@info.com, Info2$
* example@example.com, Example3!
* prova@prova.com, Prova4%
* test@test.com, Test5&
