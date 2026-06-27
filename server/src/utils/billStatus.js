export const computeBillStatus = ({ amountDue, amountPaid, balance, dueDate, cancelled = false }) => {
  if (cancelled) {
    return 'cancelled';
  }

  if (balance <= 0) {
    return 'paid';
  }

  if (amountPaid > 0 && balance > 0) {
    const due = new Date(dueDate);
    if (due < new Date()) {
      return 'overdue';
    }
    return 'partial';
  }

  const due = new Date(dueDate);
  if (due < new Date() && balance > 0) {
    return 'overdue';
  }

  return 'unpaid';
};

export const computeBillBalance = (amountDue, amountPaid) => {
  return Math.max(0, Math.round((amountDue - amountPaid) * 100) / 100);
};
