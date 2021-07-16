import React, { useState } from "react";
import { Alert } from "react-bootstrap";

const AlertMessage = (props) => {
  const { header, messages, displayable, ...alertProps } = props;
  // show consente di controllare la chiusura con la x dell'alert
  // displayable consente di abilitare la visualizzare dell'alert (a seguito
  // della presenza di un errore o di un messaggio da mostrare
  const [show, setShow] = useState(true);

  const showAlert = displayable && show;

  if (!showAlert) return null;
  return (
    <Alert onClose={() => setShow(false)} dismissible {...alertProps}>
      <Alert.Heading>{header}</Alert.Heading>
      {/*Utilizzo l'indice perchè non ci sono problemi di riordinamento o di rerendering*/}
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </Alert>
  );
};

export default AlertMessage;
