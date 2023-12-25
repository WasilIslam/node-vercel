function encodeCustomBase(number) {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const base = alphabet.length;
  let encoded = "";

  while (number > 0) {
    let remainder = number % base;
    number = Math.floor(number / base);
    encoded = alphabet.charAt(remainder) + encoded;
  }

  return encoded;
}

function generateCompactUniqueRef() {
  const now = new Date();
  // Format: YYMMDDHHMM
  const numericalDateTime = parseInt(
    now.getFullYear().toString().substr(-2) +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      ("0" + now.getDate()).slice(-2) +
      ("0" + now.getHours()).slice(-2) +
      ("0" + now.getMinutes()).slice(-2) +
      ("0" + now.getSeconds()).slice(-2)
  );
  return encodeCustomBase(numericalDateTime);
}

module.exports = { encodeCustomBase, generateCompactUniqueRef };
