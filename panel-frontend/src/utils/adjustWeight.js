const adjustWeight = (weight) => {
  const baseSize = 100;
  return { width: baseSize * weight, height: baseSize * weight };
};

export default adjustWeight;