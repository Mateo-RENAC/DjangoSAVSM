const calculateGrid = (numberOfGraphs, settings) => {
  const numberOfColumns = settings.numberOfColumns || Math.ceil(Math.sqrt(numberOfGraphs));
  const numberOfRows = settings.numberOfRows || Math.ceil(numberOfGraphs / numberOfColumns);
  return { numberOfColumns, numberOfRows };
};

export default calculateGrid;