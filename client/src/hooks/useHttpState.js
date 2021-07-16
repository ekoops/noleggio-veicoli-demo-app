import { useReducer } from "react";
import Message from "../model/Message";

const reducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        success: null,
        error: null,
      };
    case "SUCCESS":
      return {
        loading: false,
        success: action.success,
        error: null,
      };
    case "ERROR":
      return {
        loading: false,
        success: null,
        error: action.error,
      };
    default:
      return {
        loading: false,
        success: null,
        error: null,
      };
  }
};

const useHttpState = (loading) => {
  const [httpState, httpStateDispatcher] = useReducer(reducer, {
    loading,
    success: null,
    error: null,
  });

  const setLoading = () => {
    httpStateDispatcher({ type: "LOADING" });
  };

  const setSuccess = (success) => {
    httpStateDispatcher({
      type: "SUCCESS",
      success: success ? new Message(success.header, success.messages) : null,
    });
  };
  const setError = (error) => {
    const { header, messages } = error;
    httpStateDispatcher({
      type: "ERROR",
      error: new Message(header, messages),
    });
  };

  return {
    setSuccess,
    setError,
    setLoading,
    ...httpState,
  };
};

export default useHttpState;
