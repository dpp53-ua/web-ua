const getCSSVariable = (variableName) => {
    const rootStyles = getComputedStyle(document.documentElement);
    return rootStyles.getPropertyValue(variableName)?.trim() || '';
};
  
export default getCSSVariable;