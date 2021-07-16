import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import { Redirect } from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import api from "../../api/api";
import useHttpState from "../../hooks/useHttpState";
import AlertMessage from "../AlertMessage/AlertMessage";
import RentalsTable from "./RentalsTable/RentalsTable";
import utils from "../../utils/utils";

const RentalsSection = () => {
  const [rentals, setRentals] = useState([]);
  const {loading, success, error, setLoading, setSuccess, setError} = useHttpState(false);
  const { isLoggedIn, csrfToken } = useContext(AuthContext);

  const showError = !loading && error;
  const showSuccess = !!success;
  const showAlert = showError || showSuccess;

  useEffect(() => {
    if (isLoggedIn) {
      setLoading();
      api
        .getRentals(csrfToken)
        .then((rentals) => {
          setRentals(rentals);
          setSuccess(null);
        })
        .catch(setError);
    }
  }, []);

  const handleDeleteRental = (id) => {
    api
      .deleteRental(id, csrfToken)
      .then((data) => {
        const filteredRentals = rentals.filter((rental) => rental.id !== id);
        setRentals(filteredRentals);
        setSuccess(data);
      })
      .catch(setError);
  };

  if (!isLoggedIn) return <Redirect to="/" />;
  return (
    <Container fluid>
      <Row>
        <Col>
          <AlertMessage
            className="mt-2"
            {...error}
            {...success}
            variant={showError ? "danger" : "success"}
            displayable={showAlert}
          />
        </Col>
      </Row>
      <Row className="mx-auto mt-2 text-center">
        <RentalsTable
          header="Noleggi passati"
          rentals={rentals.filter((rental) => rental.endDate < utils.today)}
          controls={false}
        />
      </Row>
      <hr />
      <Row className="mx-auto text-center">
        <RentalsTable
          header="Noleggi attuali e futuri"
          rentals={rentals.filter((rental) => rental.endDate >= utils.today)}
          handleDeleteRental={handleDeleteRental}
          controls={true}
        />
      </Row>
    </Container>
  );
};

export default RentalsSection;
