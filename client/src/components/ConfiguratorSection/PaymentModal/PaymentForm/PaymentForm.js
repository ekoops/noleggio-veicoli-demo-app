import React, { useEffect } from "react";
import { Form as FormikForm, useFormikContext } from "formik";
import FormElement from "../../../FormElements/FormElement";
import { Col, Form, Row } from "react-bootstrap";
import utils from "../../../../utils/utils";

const expiryMonthOptions = utils.range(1, 12).map((n) => ({ id: n, value: n }));
const expiryYearOptions = utils
  .range(2000, 2100)
  .map((n) => ({ id: n, value: n }));

const PaymentForm = (props) => {
  const { onStateChange } = props;

  const { isValid, dirty } = useFormikContext();

  const disabled = !(isValid && dirty);

  useEffect(() => {
    onStateChange(disabled);
  }, [disabled]);

  return (
    <Form id="paymentForm" as={FormikForm}>
      <FormElement
        config={{
          label: "Nome dell'intestatario:",
          id: "holderName",
          type: "text",
          name: "holderName",
        }}
      />
      <FormElement
        config={{
          label: "Cognome dell'intestatario:",
          id: "holderSurname",
          type: "text",
          name: "holderSurname",
        }}
      />
      <FormElement
        config={{
          label: "Numero della carta:",
          id: "cardID",
          type: "text",
          name: "cardID",
          minLength: 13,
          maxLength: 13,
        }}
      />
      <Row>
        <Col md>
          <FormElement
            config={{
              label: "Mese di scadenza:",
              as: "select",
              name: "expiryMonth",
              options: expiryMonthOptions,
              custom: true,
            }}
          />
        </Col>
        <Col md>
          <FormElement
            config={{
              label: "Anno di scadenza:",
              as: "select",
              name: "expiryYear",
              options: expiryYearOptions,
              custom: true,
            }}
          />
        </Col>
      </Row>

      <FormElement
        config={{
          label: "CVV:",
          id: "CVV",
          type: "text",
          name: "CVV",
          minLength: 3,
          maxLength: 3,
        }}
      />
    </Form>
  );
};

export default PaymentForm;
