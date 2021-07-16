import React from "react";
import { Form } from "react-bootstrap";
import { ErrorMessage, Field } from "formik";
import utils from "../../utils/utils";

const FormElement = React.forwardRef((props, ref) => {
  const { config } = props;

  const { label, options, ...param } = config;

  const isDate = config.type === "date";
  const isSelect = config.as === "select";
  const isCheckbox = config.type === "checkbox";

  return (
    <Form.Group>
      <Field name={param.name}>
        {({ field, form, meta }) => {
          const isInvalid = meta.touched && meta.error;
          if (isDate) {
            field.value = field.value.toISOString().slice(0, 10);
            field.onChange = field.onInput = (e) => {
              const date =
                (e.target.value && new Date(e.target.value)) || utils.today;
              form.setFieldValue(e.target.name, date, true);
            };
          }

          return (
            <>
              {isCheckbox ? (
                <Form.Check
                  id={param.name}
                  label={label}
                  {...param}
                  {...field}
                  ref={ref}
                  custom
                />
              ) : (
                <>
                  <Form.Label
                    className={isInvalid ? "text-danger" : ""}
                    htmlFor={param.name}
                  >
                    {label}
                  </Form.Label>
                  <Form.Control
                    className={isInvalid ? "is-invalid" : ""}
                    {...param}
                    {...field}
                    ref={ref}
                  >
                    {isSelect
                      ? options.map((option) => (
                          <option key={option.id}>{option.value}</option>
                        ))
                      : null}
                  </Form.Control>
                </>
              )}
            </>
          );
        }}
      </Field>
      <ErrorMessage
        component={Form.Text}
        className="text-danger"
        name={param.name}
      />
    </Form.Group>
  );
});

export default FormElement;
