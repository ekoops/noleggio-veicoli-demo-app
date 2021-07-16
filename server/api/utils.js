const dao = require("../db/dao");

const computePrice = ({
                        userId,
                        startDate,
                        endDate,
                        category,
                        age,
                        additionalDriverNumber,
                        expectedKm,
                        extraInsurance,
                      }) => {
  const promises = [
    dao.getNumOfAvailableVehicles(category, endDate, startDate),
    dao.getNumOfCategoryVehicles(category),
    dao.getNumOfUserRental(userId),
  ];
  return Promise.all(promises).then(
    ([numOfAvailableVehicles, numOfCategoryVehicles, numOfUserRental]) => {
      const initialPrice = {
        A: 80,
        B: 70,
        C: 60,
        D: 50,
        E: 40,
      };

      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const price = initialPrice[category] * days;
      const kmPerDays = expectedKm / days;

      let coefficient = 1;
      if (kmPerDays < 50) coefficient *= 0.95;
      else if (kmPerDays < 150) coefficient *= 1;
      else coefficient *= 1.05;

      if (age < 25) coefficient *= 1.05;
      else if (age > 65) coefficient *= 1.1;

      if (additionalDriverNumber > 0) coefficient *= 1.15;

      if (extraInsurance) coefficient *= 1.2;

      if (numOfAvailableVehicles < 0.1 * numOfCategoryVehicles)
        coefficient *= 1.1;

      if (numOfUserRental > 3) coefficient *= 0.9;

      return [numOfAvailableVehicles, price * coefficient];
    }
  );
};

module.exports = {computePrice};