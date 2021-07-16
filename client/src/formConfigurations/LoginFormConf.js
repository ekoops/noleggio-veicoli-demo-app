import * as Yup from "yup";

const getLoginFormConf = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Indirizzo email non valido")
      .required("L'indirizzo email è obbligatorio"),
    password: Yup.string()
      .min(4, "Password troppo corta")
      .max(20, "Password troppo lunga")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,20}$/,
        {
          message:
            "La password deve contenere almeno una lettera minuscola, una maiuscola, un numero ed un simbolo tra @$!%*?&",
          excludeEmptyString: true,
        }
      )
      .required("La password è obbligatoria"),
  });

  return {initialValues, validationSchema}
}


export default getLoginFormConf;