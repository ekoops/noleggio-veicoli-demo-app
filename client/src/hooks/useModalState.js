import { useEffect, useReducer } from "react";

const states = {
  "SHOW": {
    show: true,
    submitted: false,
  },
  "SUBMIT": {
    show: false,
    submitted: true,
  },
  "CLOSE": {
    show: false,
    submitted: false,
  },
}


const reducer = (state, action) => {
  return states[action.type] || states["CLOSE"];
};

const useModalState = ({showCallback, submitCallback, closeCallback}) => {
  const [modalState, modalStateDispatcher] = useReducer(reducer, states["CLOSE"]);

  const showModal = function() {
    modalStateDispatcher({ type: "SHOW" });
  };
  const closeModal = function() {
    modalStateDispatcher({ type: "CLOSE" });
  };
  const submitModal = function() {
    modalStateDispatcher({ type: "SUBMIT" });
  };

  useEffect(() => {
    if (states["SHOW"] === modalState) {
      showCallback && showCallback();
    }
    else if (states["CLOSE"] === modalState) {
      closeCallback && closeCallback();
    }
    else if (states["SUBMIT"] === modalState) {
      submitCallback && submitCallback();
    }
  }, [modalState]);

  return { ...modalState, showModal, closeModal, submitModal };
};

export default useModalState;
