import React, {useEffect, useMemo} from "react";
import { useFormikContext } from "formik";
import { Form } from "react-bootstrap";
import { Form as FormikForm } from "formik";
import FormElement from "../../FormElements/FormElement";
import utils from "../../../utils/utils";
import FormButton from "../../FormElements/FormButton";

const ageOptions = utils.range(18, 80).map((n) => ({ id: n, value: n }));
const additionalDriverNumberOptions = utils
  .range(0, 4)
  .map((n) => ({ id: n, value: n }));

const ConfiguratorForm = (props) => {
  const { categories, onChange, onError, disableSubmit } = props;

  const { values, validateForm } = useFormikContext();

  useEffect(() => {
    validateForm(values).then((errors) => {
      if (Object.keys(errors).length === 0) {
        onChange(values);
      } else onError(errors);
    });
  }, [values]);

  // Props da passare ai sotto-componenti
  const categoryOptions = useMemo(() => {
      return Object.keys(categories).map((c, i) => ({
        id: i,
        value: c,
      }));
    },
    [categories]
  );

  return (
    <Form as={FormikForm}>
      <FormElement
        config={{
          label: "Data di inizio noleggio:",
          id: "startDate",
          type: "date",
          name: "startDate",
        }}
      />
      <FormElement
        config={{
          label: "Data di fine noleggio:",
          id: "endDate",
          type: "date",
          name: "endDate",
        }}
      />
      <FormElement
        config={{
          label: "Categoria:",
          as: "select",
          name: "category",
          options: categoryOptions,
          custom: true,
        }}
      />
      <FormElement
        config={{
          label: "Età:",
          as: "select",
          name: "age",
          options: ageOptions,
          custom: true,
        }}
      />
      <FormElement
        config={{
          label: "Numero di guidatori addizionali:",
          as: "select",
          name: "additionalDriverNumber",
          options: additionalDriverNumberOptions,
          custom: true,
        }}
      />
      <FormElement
        config={{
          label: "Numero di km attesi:",
          type: "number",
          name: "expectedKm",
          min: 15,
        }}
      />
      <FormElement
        config={{
          label: "Assicurazione extra",
          type: "checkbox",
          name: "extraInsurance",
        }}
      />
      <FormButton text="Procedi" loading={false} disabled={disableSubmit} />
    </Form>
  );
};

export default ConfiguratorForm;
