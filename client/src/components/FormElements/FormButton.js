import React from "react";
import { Button, Spinner } from "react-bootstrap";

const FormButton = (props) => {
  const { loading, disabled, text, ...buttonProps } = props;

  return (
    <Button type="submit" disabled={disabled} {...buttonProps}>
      {text}{" "}
      {loading ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : null}
    </Button>
  );
};

export default FormButton;
