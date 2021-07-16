import React from "react";
import Vehicle from "./Vehicle/Vehicle";
import { Container, Row } from "react-bootstrap";

const VehiclesList = (props) => {
  const { vehicles } = props;

  if (!vehicles.length) {
    return (
      <h2 className="text-muted text-center mt-4">
        Nessun veicolo disponibile per i criteri selezionati
      </h2>
    );
  }
  return (
    <Container fluid>
      <Row
        className="row-cols-1 row-cols-md-2 row-cols-lg-4 text-truncate"
        noGutters
      >
        {vehicles.map((vehicle) => (
          <Vehicle key={vehicle.id} vehicle={vehicle} />
        ))}
      </Row>
    </Container>
  );
};

export default VehiclesList;
