class Rental {
  constructor(
    id,
    refUser,
    refVehicle,
    startDate,
    endDate,
    age,
    expectedKm,
    extraInsurance,
    additionalDriverNumber,
    rentalPrice
  ) {
    this.id = parseInt(id);
    if (isNaN(this.id)) throw Error("Invalid rental id value");

    this.refUser = parseInt(refUser);
    if (isNaN(this.refUser)) throw Error("Invalid user id value");

    this.refVehicle = parseInt(refVehicle);
    if (isNaN(this.refVehicle)) throw Error("Invalid vehicle id value");

    this.startDate = parseInt(startDate);
    if (isNaN(this.startDate)) throw Error("Invalid start date value");

    this.endDate = parseInt(endDate);
    if (isNaN(this.endDate)) throw Error("Invalid end date value");

    this.age = parseInt(age);
    if (isNaN(this.age)) throw Error("Invalid age value");

    this.expectedKm = parseInt(expectedKm);
    if (isNaN(this.expectedKm)) throw Error("Invalid expected km value");

    this.extraInsurance = Boolean(extraInsurance);

    this.additionalDriverNumber = parseInt(additionalDriverNumber);
    if (isNaN(this.additionalDriverNumber))
      throw Error("Invalid additional driver number value");

    this.rentalPrice = parseFloat(rentalPrice);
    if (isNaN(this.rentalPrice)) throw Error("Invalid rental price value");
  }

  static fromObj({
    id,
    refUser,
    refVehicle,
    startDate,
    endDate,
    age,
    expectedKm,
    extraInsurance,
    additionalDriverNumber,
    rentalPrice,
  }) {
    return new Rental(
      id,
      refUser,
      refVehicle,
      startDate,
      endDate,
      age,
      expectedKm,
      extraInsurance,
      additionalDriverNumber,
      rentalPrice
    );
  }
}

module.exports = Rental;
