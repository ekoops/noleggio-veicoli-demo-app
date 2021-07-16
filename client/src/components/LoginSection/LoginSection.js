import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import AlertMessage from "../AlertMessage/AlertMessage";
import LoginForm from "./LoginForm/LoginForm";
import AuthContext from "../../contexts/AuthContext";
import getLoginFormConf from "../../formConfigurations/LoginFormConf";
import useHttpState from "../../hooks/useHttpState";
import api from "../../api/api";

const loginFormConf = getLoginFormConf();

const LoginSection = (props) => {
  const { setLoginState } = props;

  const {loading, error, setLoading, setError} = useHttpState(false);
  const { isLoggedIn } = useContext(AuthContext);

  const showError = !loading && error;

  const onSubmit = (userData) => {
    setLoading();
    api
      .login(userData)
      .then(setLoginState)
      .catch(setError);
  };

  // Props da passare ai sotto-componenti
  const formikProps = { onSubmit, ...loginFormConf };

  if (isLoggedIn) return <Redirect to="/" />;
  return (
    <Container fluid>
      <Row noGutters>
        <Col className="mx-auto mt-2" md={6} lg={5}>
          <AlertMessage {...error} displayable={showError} variant="danger" />
          <Formik {...formikProps}>
            <LoginForm loading={loading} />
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginSection;
