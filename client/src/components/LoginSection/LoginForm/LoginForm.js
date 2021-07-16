import React, { useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import { Form } from "react-bootstrap";
import { Form as FormikForm } from "formik";
import FormElement from "../../FormElements/FormElement";
import FormButton from "../../FormElements/FormButton";

const LoginForm = (props) => {
  const { loading } = props;
  const { isValid, dirty } = useFormikContext();
  const inputEmail = useRef(null);

  const disabled = !(isValid && dirty);

  useEffect(() => {
    inputEmail.current.focus();
  }, []);

  return (
    <Form as={FormikForm}>
      <FormElement
        config={{
          label: "Email:",
          id: "email",
          type: "email",
          name: "email",
          placeholder: "Email...",
        }}
        ref={inputEmail}
      />
      <FormElement
        config={{
          label: "Password:",
          id: "password",
          type: "password",
          name: "password",
          placeholder: "Password...",
        }}
      />
      <FormButton text="Login" loading={loading} disabled={disabled} />
    </Form>
  );
};

export default LoginForm;
