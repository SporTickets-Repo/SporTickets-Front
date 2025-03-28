export function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export function formatExpiryDate(value: string) {
  return value
    .replace(/\D/g, "")
    .substring(0, 4)
    .replace(/^(\d{2})(\d{1,2})$/, "$1/$2");
}

export function formatCVV(value: string) {
  return value.replace(/\D/g, "").substring(0, 4);
}

export function detectCardType(cardNumber: string) {
  const number = cardNumber.replace(/\D/g, "");

  const patterns: { [key: string]: RegExp } = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    elo: /^(((636368)|(438935)|(504175)|(451416)|(636297)))/,
    hipercard: /^(38|60)/,
  };

  for (const [brand, pattern] of Object.entries(patterns)) {
    if (pattern.test(number)) return brand;
  }

  return null;
}

export function isValidCardNumber(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "").split("").reverse().map(Number);

  const sum = digits.reduce((acc, digit, idx) => {
    if (idx % 2 === 1) {
      const doubled = digit * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }
    return acc + digit;
  }, 0);

  return sum % 10 === 0;
}

export function isValidName(value: string) {
  return /^[A-Za-zÀ-ú\s]+$/.test(value.trim());
}

export function isFutureExpiryDate(value: string) {
  const [month, year] = value.split("/").map(Number);
  if (!month || !year || month < 1 || month > 12) return false;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = Number(now.getFullYear().toString().slice(-2));

  return year > currentYear || (year === currentYear && month >= currentMonth);
}
