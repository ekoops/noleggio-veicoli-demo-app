import React, { useContext, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Formik } from "formik";
import ConfiguratorForm from "./ConfiguratorForm/ConfiguratorForm";
import useHttpState from "../../hooks/useHttpState";
import AuthContext from "../../contexts/AuthContext";
import api from "../../api/api";
import AlertMessage from "../AlertMessage/AlertMessage";
import PaymentModal from "./PaymentModal/PaymentModal";
import getConfiguratorFormConf from "../../formConfigurations/ConfiguratorFormConf";
import useModalState from "../../hooks/useModalState";

const ConfiguratorSection = (props) => {
  const { categories } = props;

  const { success, error, setSuccess, setError } = useHttpState(false);
  const [rentalParams, setRentalParams] = useState({}); // oggetto utilizzato per passare i parametri al modal
  const [proposal, setProposal] = useState({
    numOfAvailableVehicles: null,
    rentalPrice: null,
  });
  const { show, submitted, showModal, closeModal, submitModal } = useModalState(
    {
      submitCallback: () => {
        setSuccess({
          header: "Pagamento effettuato con successo",
          messages: ["Il noleggio è andato a buon fine"],
        });
      },
    }
  );
  const { csrfToken } = useContext(AuthContext);

  // Computazioni sullo stato
  const showError = !!error;
  const showSuccess = !!success;
  const showAlert = showError || showSuccess;
  const disableSubmit = error || submitted; // Flag per disabilitare il tasto procedi

  // Metodo invocato quando l'utente effettua un cambiamento valido nel form
  const getProposal = (proposalParams) => {
    closeModal(); // se il modal è già chiuso non avviene nessun re-rendering
    api
      .getProposal(proposalParams, csrfToken)
      .then((proposal) => {
        setProposal(proposal);
        setSuccess({
          header: "Disponibilità",
          messages: [
            `Numero di auto: ${proposal.numOfAvailableVehicles}`,
            `Prezzo di noleggio: ${proposal.rentalPrice.toFixed(2)} €`,
          ],
        });
      })
      .catch(setError);
  };

  // Metodo invocato quando l'utente effettua un cambiamento non valido nel form
  const setConfiguratorError = (errors) => {
    closeModal(); // se il modal è già chiuso non avviene nessun re-rendering
    setError({
      header: "Campi non validi",
      messages: ["I seguenti errori sono stati riscontrati nel form:"].concat(
        Object.values(errors)
      ),
    });
  };

  // Metodo invocato quando l'utente clicca su procedi per andare al modal di pagamento
  const onSubmit = (values) => {
    setRentalParams(values);
    showModal();
  };

  // Props da passare ai sotto-componenti
  const formikProps = useMemo(
    () => ({ onSubmit, ...getConfiguratorFormConf(categories) }),
    [categories]
  );

  const ConfiguratorFormProps = {
    categories,
    disableSubmit,
    onChange: getProposal,
    onError: setConfiguratorError,
  };

  const PaymentModalProps = {
    show,
    closeModal,
    submitModal,
    rentalParams,
    rentalPrice: proposal.rentalPrice,
  };

  return (
    <Container fluid>
      <Row className="mt-2">
        <Col md={{ order: 2, span: 5 }}>
          <AlertMessage
            {...error}
            {...success}
            displayable={showAlert}
            variant={showError ? "danger" : "success"}
            dismissible={false}
          />
        </Col>
        <Col md={{ order: 1, span: 7 }}>
          <Formik {...formikProps}>
            <ConfiguratorForm {...ConfiguratorFormProps} />
          </Formik>
        </Col>
      </Row>
      <PaymentModal {...PaymentModalProps} />
    </Container>
  );
};

export default ConfiguratorSection;
