const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");

const getAllUsersControllers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "User data fecthed",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting the user list",
      error,
    });
  }
};

const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctor data fecthed",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting the Doctor list",
      error,
    });
  }
};

const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, {
      status,
    });
    const user = await userModel.findOne({ _id: doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "Doctor-Account-Updated",
      message: `Your Request has been ${status}`,
      onClickPath: "/notification",
    });
    const updatedUser = await user.save();

    if (status === "approved") {
      updatedUser.isDoctor = true;
    } else {
      updatedUser.isDoctor = false;
    }
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account status updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while approving the Doctor",
      error,
    });
  }
};

module.exports = {
  getAllUsersControllers,
  getAllDoctorsControllers,
  changeAccountStatusController,
};
