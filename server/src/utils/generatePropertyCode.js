import Property from '../models/Property.js';

export const generatePropertyCode = async () => {
  const count = await Property.countDocuments();
  const next = String(count + 1).padStart(4, '0');
  return `PROP-${next}`;
};
