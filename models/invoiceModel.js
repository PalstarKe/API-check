const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceID: { type: String, required: true, unique: true },
    senderAddress: {
      senderName: { type: String },
      senderEmail: { type: String },
      senderPhone: { type: Number },
    },
    invoiceDate: { type: Date },
    status: { type: Number },
    items: { 
      order_id: { type: String },
      date_delivered: { type: String },
      cpp: { type: Number },
      pages: { type: Number },
      item_total: { type: Number },
    },
    totalInvoicePrice: { type: Number },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoices", InvoiceSchema);
module.exports = Invoice