const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const BookingService = require('../services/bookingService');

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Registration succesful", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid E-Mail or Password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Error in Login controller ${error.message}`,
      success: false,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Auth Error",
      success: false,
      error,
    });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "doctor-register-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has requested to be registered as a Doctor`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while Doctor Registration",
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);

    user.notification = [];
    user.seennotification = notification;
    console.log(user.seennotification);
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All pending notifications read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete all notifications",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctor = await doctorModel.find({ status: "approved" });

    res.status(200).send({
      success: true,
      message: "Doctor List found",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete all notifications",
      error,
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    const parsedDate = moment(req.body.date, "DD-MM-YYYY").startOf('day');
    
    if (!parsedDate.isValid()) {
      return res.status(400).send({
        success: false,
        message: "Invalid date format"
      });
    }

    const appointmentData = {
      ...req.body,
      status: "pending",
      date: parsedDate.toDate(),
      time: req.body.time
    };

    const result = await BookingService.createAppointment(appointmentData);
    
    res.status(200).send(result);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).send({
      success: false,
      message: error.message || "Error while booking appointment",
    });
  }
};

const bookAvailabilityController = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const isAvailable = await BookingService.checkAvailability(doctorId, date, time);

    res.status(200).send({
      success: true,
      message: isAvailable ? "Time slot is available" : "Time slot is not available",
      available: isAvailable
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).send({
      success: false,
      message: "Error checking availability",
      error: error.message
    });
  }
};

const userAppointmentController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Appointments fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to fect all appointments",
      error,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookAvailabilityController,
  userAppointmentController,
};
