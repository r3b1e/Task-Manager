export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};
export const addThousandsSeparator = (val) => {
  if (val == null || isNaN(val) ) return "";

  const [integerPart, fractionalPart] = val.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionalPart
  ? `${formattedInteger}.${fractionalPart}`
  :formattedInteger

}


