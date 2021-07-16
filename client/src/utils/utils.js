const range = (min, max) => {
  let v = [];
  for (let i = min; i <= max; i++) v.push(i);
  return v;
};

const today = new Date(new Date().toISOString().slice(0,10));

const formatDate = (date) => {
  return date.toISOString().slice(0, 10).split("-").reverse().join("/");
};

const hash = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash  = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export default { range, today, formatDate, hash };
