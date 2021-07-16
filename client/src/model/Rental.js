class Rental {
  constructor(id, startDate, endDate, model, category, brand, rentalPrice) {
    this.id = parseInt(id);
    if (isNaN(this.id)) throw Error("Invalid rental id value");

    this.startDate = new Date(+startDate);
    if (isNaN(this.startDate)) throw Error("Invalid start date value");

    this.endDate = new Date(+endDate);
    if (isNaN(this.endDate)) throw Error("Invalid end date value");

    this.model = model.toString();
    this.category = category.toString();
    this.brand = brand.toString();

    this.rentalPrice = parseFloat(rentalPrice);
    if (isNaN(this.rentalPrice)) throw Error("Invalid rental price value");
  }

  static fromObj({
    id,
    startDate,
    endDate,
    model,
    category,
    brand,
    rentalPrice,
  }) {
    return new Rental(
      id,
      startDate,
      endDate,
      model,
      category,
      brand,
      rentalPrice
    );
  }
}

export default Rental;
