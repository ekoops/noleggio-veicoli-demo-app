import "./App.css";
import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import VehiclesSection from "./components/VehiclesSection/VehiclesSection";
import LoginSection from "./components/LoginSection/LoginSection";
import NavBar from "./components/NavBar/NavBar";
import AuthContext from "./contexts/AuthContext";
import ConfiguratorSection from "./components/ConfiguratorSection/ConfiguratorSection";
import api from "./api/api";
import useHttpState from "./hooks/useHttpState";
import RentalsSection from "./components/RentalsSection/RentalsSection";
import AlertMessage from "./components/AlertMessage/AlertMessage";
import LoadSpinner from "./components/LoadSpinner/LoadSpinner";

const App = () => {
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const { loading, error, setSuccess, setError } = useHttpState(true);
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    csrfToken: null,
    isLoaded: false, // serve per verificare se lo stato è stato richiesto al server o meno
  });

  // Estrazioni dagli stati composti
  const { isLoggedIn } = authState;

  // Computazioni sugli stati
  const showError = !loading && error;
  const noError = !loading && !error;
  const logged = noError && isLoggedIn;
  const notLogged = noError && !isLoggedIn;

  useEffect(() => {
    const promises = [
      api.getUserInfo(),
      api.getAllCategories(),
      api.getAllBrands(),
    ];

    Promise.all(promises)
      .then(([userInfo, categories, brands]) => {
        if (userInfo.user) {
          setAuthState({
            isLoggedIn: true,
            user: userInfo.user,
            csrfToken: userInfo.csrfToken,
            isLoaded: true,
          });
        } else setAuthState((authState) => ({ ...authState, isLoaded: true }));
        setCategories(categories);
        setBrands(brands);
      })
      .catch(setError);
  }, []);

  useEffect(() => {
    // Solo dopo la fase di caricamento iniziale... evito i transitori dei singoli stati inizialmente
    // per diminuire il numero di richieste fatte al server
    if (
      Object.keys(categories).length &&
      Object.keys(brands).length &&
      authState.isLoaded
    ) {
      api.getVehicles({ brands, categories }).then(vehicles => {
        setVehicles(vehicles);
        // Dopo la fase di caricamento iniziale, cambio
        // lo stato a SUCCESS in modo tale da permettere la visualizzazione
        // della schermata iniziale
        if (loading) setSuccess(null);
      }).catch(setError);
    }
  }, [brands, categories]);

  const changeBrandSelection = (e) => {
    setBrands({ ...brands, [e.target.name]: e.target.checked });
  };
  const changeCategorySelection = (e) => {
    setCategories({ ...categories, [e.target.name]: e.target.checked });
  };

  const setLoginState = (data) => {
    setAuthState({
      isLoggedIn: true,
      user: data.user,
      csrfToken: data.csrfToken,
      isLoaded: true,
    });
  };

  const setLogoutState = () => {
    setAuthState({
      isLoggedIn: false,
      user: null,
      csrfToken: null,
      isLoaded: true,
    });
  };

  // Props da passare ai sotto-componenti
  const navBarProps = {
    logged,
    notLogged,
    setLogoutState,
    setError,
  };
  const vehiclesSectionProps = {
    brands,
    categories,
    vehicles,
    changeBrandSelection,
    changeCategorySelection,
  };

  return (
    <AuthContext.Provider value={authState}>
      <NavBar {...navBarProps} />

      <AlertMessage
        variant="danger"
        {...error}
        displayable={showError}
        dismissible={false}
      />

      <LoadSpinner loading={loading} />
      {noError ? (
        <Switch>
          <Route path="/rentals">
            <RentalsSection />
          </Route>
          <Route path="/login">
            <LoginSection setLoginState={setLoginState} />
          </Route>
          <Route path="/">
            {isLoggedIn ? (
              <ConfiguratorSection categories={categories} />
            ) : (
              <VehiclesSection {...vehiclesSectionProps} />
            )}
          </Route>
        </Switch>
      ) : null}
    </AuthContext.Provider>
  );
};

export default App;
