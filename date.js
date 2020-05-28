
exports.getDate = getDate;

function getDate() {
  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"};

  return today.toLocaleDateString("en-UK", options);

}

exports.getDay = getDay;

function getDay() {
  const today = new Date();

  const options = {
    weekday: "long"
  };

  return today.toLocaleDateString("en-UK", options);
}
