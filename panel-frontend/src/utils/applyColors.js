const applyColors = (data, colors) => {
  // Apply custom colors logic
  return data.map((item, index) => ({
    ...item,
    color: colors[index % colors.length]
  }));
};

export default applyColors;