class Vehicle {
  constructor(id, brand, category, model) {
    this.id = parseInt(id);
    if (isNaN(this.id)) throw Error("Invalid vehicle id value");
    this.brand = brand.toString();
    this.category = category.toString();
    this.model = model.toString();
  }

  static fromObj({id, brand, category, model}) {
    return new Vehicle(id, brand, category, model);
  }
}

module.exports = Vehicle;