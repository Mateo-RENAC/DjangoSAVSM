const applyScale = (data, scale) => {
  // Apply custom scaling logic
  return data.map(item => ({
    ...item,
    value: item.value * scale
  }));
};

export default applyScale;