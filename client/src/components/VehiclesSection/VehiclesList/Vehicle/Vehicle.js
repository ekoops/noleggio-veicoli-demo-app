import React from "react";
import { Badge, Card, Col } from "react-bootstrap";
import vehicleImg from "./Vehicle.png";
import utils from "../../../../utils/utils";

const BadgeColors = ["primary", "success", "danger", "warning", "info"];
let cachedColors = {};

const getColor = (category) => {
  if (category in cachedColors) return cachedColors[category];
  return BadgeColors[utils.hash(category)%BadgeColors.length];
}

const Vehicle = (props) => {
  const { vehicle } = props;

  const color = getColor(vehicle.category);

  return (
    <Col>
      <Card
        className="card m-2 font-weight-bold text-center"
        bg="light"
        text="dark"
      >
        <Card.Header>
          {vehicle.brand} {vehicle.model}
        </Card.Header>
        <Card.Img variant="top" src={vehicleImg} />

        <h3>
          Categoria:{" "}
          <Badge pill variant={color}>
            {vehicle.category}
          </Badge>
        </h3>
      </Card>
    </Col>
  );
};

export default Vehicle;
