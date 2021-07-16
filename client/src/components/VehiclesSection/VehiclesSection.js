import React from "react";
import FiltersList from "./FiltersList/FiltersList";
import VehiclesList from "./VehiclesList/VehiclesList";
import { Container } from "react-bootstrap";

const VehiclesSection = (props) => {
  const {vehicles, ...vehiclesListProps} = props;

  return (
    <Container fluid>
      <FiltersList {...vehiclesListProps} />
      <VehiclesList vehicles={vehicles} />
    </Container>
  );
};

export default VehiclesSection;
