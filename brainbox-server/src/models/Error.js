const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
  message: { type: String, required: true },
  stack: { type: String },
  name: { type: String, required: true },
  code: { type: String },
  statusCode: { type: Number },
  context: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true },
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date },
  resolvedBy: { type: String },
  resolution: { type: String },
  environment: { type: String },
  version: { type: String },
  user: {
    id: { type: String },
    email: { type: String }
  },
  request: {
    method: { type: String },
    url: { type: String },
    headers: { type: mongoose.Schema.Types.Mixed },
    body: { type: mongoose.Schema.Types.Mixed },
    ip: { type: String }
  }
}, {
  timestamps: true
});

// Index for faster queries
errorSchema.index({ timestamp: -1 });
errorSchema.index({ name: 1, timestamp: -1 });
errorSchema.index({ resolved: 1, timestamp: -1 });

// Statics for common queries
errorSchema.statics.getRecentErrors = function(hours = 24) {
  return this.find({
    timestamp: { $gt: new Date(Date.now() - hours * 60 * 60 * 1000) }
  }).sort({ timestamp: -1 });
};

errorSchema.statics.getErrorSummary = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$name',
        count: { $sum: 1 },
        lastOccurrence: { $max: '$timestamp' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

const Error = mongoose.model('Error', errorSchema);

module.exports = Error;
