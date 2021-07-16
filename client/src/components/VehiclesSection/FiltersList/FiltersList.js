import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const FiltersSubList = (props) => {
  const { obj, sectionName, handleChange } = props;
  const array = Object.keys(obj);
  if (!array.length) return null;
  return (
    <Col md className="mt-2">
      <h2>{sectionName}</h2>
      <Form>
        {array.map((key) => (
          <Form.Switch
            key={key}
            id={key}
            name={key}
            label={key}
            value={obj[key]}
            onChange={handleChange}
          />
        ))}
      </Form>
    </Col>
  );
};

const FiltersList = (props) => {
  const {
    brands,
    categories,
    changeBrandSelection,
    changeCategorySelection,
  } = props;

  return (
    <Container className="bg-light" fluid>
      <Row>
        <FiltersSubList
          obj={brands}
          sectionName="Filtra per marca"
          handleChange={changeBrandSelection}
        />
        <FiltersSubList
          obj={categories}
          sectionName="Filtra per categorie"
          handleChange={changeCategorySelection}
        />
      </Row>
    </Container>
  );
};

export default FiltersList;
