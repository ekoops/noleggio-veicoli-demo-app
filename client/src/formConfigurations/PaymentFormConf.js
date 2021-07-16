import * as Yup from "yup";
import utils from "../utils/utils";

const getPaymentFormConf = (categories) => {
  const date = utils.today;
  const minMonth = date.getMonth() + 1;
  const minYear = date.getFullYear();

  const validationSchema = Yup.object().shape({
    holderName: Yup.string()
      .min(4, "Nome dell'intestatario troppo corto")
      .max(20, "Nome dell'intestatario troppo lungo")
      .matches(/^[A-Za-z\s]{4,20}$/, {
        message: "Il nome dell'intestatario deve contenere caratteri validi",
        excludeEmptyString: true,
      })
      .required("Il nome dell'intestatario è obbligatorio"),
    holderSurname: Yup.string()
      .min(4, "Cognome dell'intestatario troppo corto")
      .max(20, "Cognome dell'intestatario troppo lungo")
      .matches(/^[A-Za-z\s]{4,20}$/, {
        message: "Il cognome dell'intestatario deve contenere caratteri validi",
        excludeEmptyString: true,
      })
      .required("Il cognome dell'intestatario è obbligatorio"),
    cardID: Yup.string()
      .matches(/^\d{13}$/, {
        message: "Il numero della carta deve essere composto da 13 cifre",
        excludeEmptyString: true,
      })
      .required("Il numero della carta è obbligatorio"),
    expiryMonth: Yup.number().when('expiryYear', (expiryYear, schema) => {
      return parseInt(expiryYear) === minYear ? schema.min(minMonth, "Il mese di scadenza è nel passato") : schema;
    }).required("Il mese di scadenza della carta è obbligatorio"),
    expiryYear: Yup.number().min(minYear, "L'anno di scadenza è nel passato").required("L'anno di scadenza della carta è obbligatorio"),
    CVV: Yup.string()
      .matches(/^\d{3}$/, {
        message: "Il CVV della carta deve essere composto da 3 cifre",
        excludeEmptyString: true,
      })
      .required("Il CVV della carta è obbligatorio"),
  });

  const initialValues = {
    holderName: "",
    holderSurname: "",
    cardID: "",
    expiryMonth: minMonth,
    expiryYear: minYear,
    CVV: "",
  };

  return { initialValues, validationSchema };
};

export default getPaymentFormConf;
