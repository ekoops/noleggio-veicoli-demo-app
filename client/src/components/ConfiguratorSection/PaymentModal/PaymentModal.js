import React, { useContext, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import cartLogo from "./cart.svg";
import PaymentForm from "./PaymentForm/PaymentForm";
import getPaymentFormConf from "../../../formConfigurations/PaymentFormConf";
import { Formik } from "formik";
import useHttpState from "../../../hooks/useHttpState";
import api from "../../../api/api";
import AuthContext from "../../../contexts/AuthContext";
import AlertMessage from "../../AlertMessage/AlertMessage";
import FormButton from "../../FormElements/FormButton";

const paymentFormConf = getPaymentFormConf();

const PaymentModal = (props) => {
  const { rentalParams, rentalPrice, show, closeModal, submitModal } = props;
  const { loading, error, setSuccess, setError, setLoading } = useHttpState(
    false
  );
  const [disabled, setDisabled] = useState(true);
  const { csrfToken } = useContext(AuthContext);

  const showError = !loading && error;
  const price = rentalPrice && rentalPrice.toFixed(2);

  const changeDisabledState = (disabled) => {
    setDisabled(disabled);
  };

  const onSubmit = (values) => {
    setLoading();
    api
      .submitPayment({ ...values, rentalPrice }, csrfToken)
      .then((isPaymentDone) => {
        if (isPaymentDone) {
          return api
            .createRental({ ...rentalParams, rentalPrice }, csrfToken)
            .then(() => {
              setSuccess(null); // per resettare lo spinner del button
              submitModal();
            });
        }
      })
      .catch(setError);
  };

  // Props da passare ai sotto-componenti
  const formikProps = { onSubmit, ...paymentFormConf };

  return (
    <Modal show={show} onHide={closeModal} animation={false}>
      <Modal.Header closeButton>

        <Modal.Title>
          <img className="align-text-top" alt="cartLogo" width="30" height="30" src={cartLogo} />
          {" "}<span>Dati pagamento</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AlertMessage {...error} displayable={showError} variant="danger" />
        <Row noGutters>
          <Col className="text-left">
            <h3>Prezzo:</h3>
          </Col>
          <Col className="text-right">
            <h3>{price} €</h3>
          </Col>
        </Row>
        <Formik {...formikProps}>
          <PaymentForm onStateChange={changeDisabledState} />
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <FormButton
          text="Noleggia"
          form="paymentForm"
          disabled={disabled}
          loading={loading}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
