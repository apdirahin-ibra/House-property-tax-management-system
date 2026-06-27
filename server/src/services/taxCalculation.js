export const calculateBaseTax = (taxRate, assessedValue) => {
  if (taxRate.rateType === 'fixed') {
    return taxRate.rateValue;
  }

  if (taxRate.rateType === 'percentage') {
    return (assessedValue * taxRate.rateValue) / 100;
  }

  throw new Error('Invalid rate type');
};

export const calculateTotalDue = (baseTax, penalty = 0, discount = 0) => {
  const total = baseTax + penalty - discount;
  return Math.max(0, Math.round(total * 100) / 100);
};
