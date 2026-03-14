const Counter = require('../models/Counter');

const generateTrackingId = async () => {
  const year = new Date().getFullYear();
  
  const counter = await Counter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  
  const seq = String(counter.seq).padStart(3, '0');
  return `NEO-${year}-${seq}`;
};

module.exports = generateTrackingId;
