import * as Yup from "yup";
import utils from "../utils/utils";

const getConfiguratorFormConf = (categories) => {
  const startDate = utils.today;

  const endDate = utils.today;
  const todayPlusAYear = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);

  const validationSchema = Yup.object().shape({
    startDate: Yup.date()
      .min(startDate, "Non si può iniziare il noleggio nel passato!")
      .max(
        Yup.ref("endDate"),
        "Non si può iniziare il noleggio dopo la data di fine"
      )
      .required("È necessario fornire una data di inizio noleggio valida"),
    endDate: Yup.date()
      .min(
        Yup.ref("startDate"),
        "Non si può finire il noleggio prima della data di inizio"
      )
      .max(
        todayPlusAYear,
        "Non si può finire il noleggio a più di un anno di distanza da oggi!"
      )
      .required("È necessario fornire una data di fine noleggio valida"),
    category: Yup.string().required("È necessario fornire una categoria valida"),
    age: Yup.number()
      .min(18, "È necessario avere almeno 18 anni")
      .max(80, "È necessario avere meno di 80 anni")
      .required("È necessario fornire un'età valida"),
    additionalDriverNumber: Yup.number()
      .min(
        0,
        "Non è possibile fornire un numero negativo di guidatori addizionali"
      )
      .max(4, "Non è possibile che vi siano più di 4 guidatori addizionali")
      .required(
        "È necessario fornire un numero di guidatori addizionali valido (anche 0) "
      ),
    expectedKm: Yup.number()
      .min(15, "Non è possibile noleggiare per meno di 15 kilometri")
      .required(
        "È necessario fornire un'approssimazione valida del numero di kilometri che si intende percorrere durante il noleggio"
      ),
    extraInsurance: Yup.boolean(),
  });
  const category = Object.keys(categories)[0];
  const initialValues = {
    startDate: startDate,
    endDate: endDate,
    category: category,
    age: 18,
    additionalDriverNumber: 0,
    expectedKm: 15,
    extraInsurance: false,
  };

  return {initialValues, validationSchema};
}

export default getConfiguratorFormConf;