const redisClient = require('../config/redis');
const appointmentModel = require('../models/appointmentModel');
const { sendAppointmentEmail } = require('./emailService');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const LOCK_TIMEOUT = 30; // 30 seconds

class BookingService {
  static async acquireLock(doctorId, date, time) {
    const lockKey = `booking:lock:${doctorId}:${date}:${time}`;
    const acquired = await redisClient.set(lockKey, '1', 'NX', 'EX', LOCK_TIMEOUT);
    return acquired === 'OK';
  }

  static async releaseLock(doctorId, date, time) {
    const lockKey = `booking:lock:${doctorId}:${date}:${time}`;
    await redisClient.del(lockKey);
  }

  static async checkAvailability(doctorId, date, time) {
    // Parse the date to match our stored format
    const parsedDate = moment(date, "DD-MM-YYYY").startOf('day').toDate();

    // Check if the time slot is already booked
    const existingAppointment = await appointmentModel.findOne({
      doctorId,
      date: parsedDate,
      time,
      status: { $ne: 'cancelled' }
    });

    return !existingAppointment;
  }

  static async createAppointment(appointmentData) {
    const { doctorId, date, time } = appointmentData;

    try {
      // Try to acquire lock
      const lockAcquired = await this.acquireLock(doctorId, date, time);
      if (!lockAcquired) {
        throw new Error('This slot is currently being booked by another user. Please try again.');
      }

      // Check availability again (double-check)
      const isAvailable = await this.checkAvailability(doctorId, date, time);
      if (!isAvailable) {
        throw new Error('This slot is no longer available.');
      }

      // Add chatId to appointment data
      const appointmentWithChat = {
        ...appointmentData,
        chatId: uuidv4()  // Generate unique chat ID
      };

      // Create appointment
      const appointment = new appointmentModel(appointmentWithChat);
      await appointment.save();

      // Send confirmation email (non-blocking)
      sendAppointmentEmail(appointmentWithChat).catch(error => {
        console.error('Error sending confirmation email:', error);
      });

      return {
        success: true,
        message: 'Appointment booked successfully',
        data: appointment
      };
    } finally {
      // Always release the lock
      await this.releaseLock(doctorId, date, time);
    }
  }
}

module.exports = BookingService; 