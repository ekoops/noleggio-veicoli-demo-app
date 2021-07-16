import utils from "../../../utils/utils";
import deleteLogo from "./delete.svg";
import { Col, Table } from "react-bootstrap";
import React from "react";

const TableRow = (props) => {
  const { deletable, rental, handleDeleteRental, controls } = props;

  const formattedStartDate = utils.formatDate(rental.startDate);
  const formattedEndDate = utils.formatDate(rental.endDate);
  const price = rental.rentalPrice.toFixed(2);

  return (
    <tr>
      <td>{rental.id}</td>
      <td>{rental.brand}</td>
      <td>{rental.model}</td>
      <td>{rental.category}</td>
      <td>{formattedStartDate}</td>
      <td>{formattedEndDate}</td>
      <td>{price} €</td>
      {controls ? (
        <td>
          {deletable ? (
            <a href="#" title="Elimina noleggio" onClick={() => handleDeleteRental(rental.id)}>
              <img alt="Elimina noleggio" src={deleteLogo} width={30} height={30} />
            </a>
          ) : <span>Già iniziato</span>}
        </td>
      ) : null}
    </tr>
  );
};

const RentalsTable = (props) => {
  const { rentals, header, handleDeleteRental, controls } = props;

  const sortedRentals = rentals.sort((r1, r2) => r2.startDate - r1.startDate);

  return (
    <Col lg className="mt-2">
      <h1>{header}</h1>
      {rentals.length ? (
        <Table className="text-center" striped hover responsive={true}>
          <thead>
            <tr>
              <th>#</th>
              <th>Marca</th>
              <th>Modello</th>
              <th>Categoria</th>
              <th>Data inizio</th>
              <th>Data fine</th>
              <th>Prezzo</th>
              {controls ? <th>Controlli</th> : null}
            </tr>
          </thead>
          <tbody>
            {sortedRentals.map((rental) => (
              <TableRow
                key={rental.id}
                rental={rental}
                controls={controls}
                deletable={rental.startDate > utils.today}
                handleDeleteRental={handleDeleteRental}
              />
            ))}
          </tbody>
        </Table>
      ) : (
        <h3>Non sono presenti noleggi</h3>
      )}
    </Col>
  );
};

export default RentalsTable;
