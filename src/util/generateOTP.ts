const generateOTP = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
};

export default generateOTP;

// const generateOTP = () => {
//   return Math.floor(10000 + Math.random() * 90000);
// };

// export default generateOTP;
