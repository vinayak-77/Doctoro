const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "First Name is Required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is Required"],
    },
    email: {
      type: String,
      required: [true, "E-Mail is Required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Address is Required"],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is Required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is Required"],
    },
    feesPerConsultation: {
      type: Number,
      required: [true, "Fees is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    timings: {
      type: Object,
      required: [true, "Timing is required"],
    },
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
