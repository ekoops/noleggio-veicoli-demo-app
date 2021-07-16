import React from "react";
import { Spinner } from "react-bootstrap";

const LoadSpinner = (props) => {
  const { loading } = props;

  if (!loading) return null;
  return (
    <Spinner
      className="load-spinner"
      animation="border"
      variant="primary"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

export default LoadSpinner;
