const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user (Step 1)
  static async createUser(userData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Hash the password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      // Check if email already exists
      const emailCheck = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [userData.email]
      );

      if (emailCheck.rows.length > 0) {
        throw new Error('Email already registered');
      }

      // Check if phone number already exists
      const phoneCheck = await client.query(
        'SELECT id FROM users WHERE phone_number = $1',
        [userData.phoneNumber]
      );

      if (phoneCheck.rows.length > 0) {
        throw new Error('Phone number already registered');
      }

      // Insert new user
      const userResult = await client.query(
        `INSERT INTO users (username, email, phone_number, password_hash, email_verified)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, username, email, phone_number, email_verified, created_at`,
        [userData.username, userData.email, userData.phoneNumber, passwordHash, true]
      );

      await client.query('COMMIT');
      return userResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Complete registration with firm details (Step 2)
  static async completeFirmRegistration(userId, firmData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if firm name already exists
      const firmNameCheck = await client.query(
        'SELECT id FROM law_firms WHERE firm_name = $1',
        [firmData.firmName]
      );

      if (firmNameCheck.rows.length > 0) {
        throw new Error('Firm name already registered');
      }

      // Check if license number already exists
      const licenseCheck = await client.query(
        'SELECT id FROM law_firms WHERE license_number = $1',
        [firmData.licenseNumber]
      );

      if (licenseCheck.rows.length > 0) {
        throw new Error('License number already registered');
      }

      // Insert firm data
      const firmResult = await client.query(
        `INSERT INTO law_firms (user_id, firm_name, firm_address, license_number, registration_status)
         VALUES ($1, $2, $3, $4, 'completed')
         RETURNING *`,
        [userId, firmData.firmName, firmData.firmAddress, firmData.licenseNumber]
      );

      await client.query('COMMIT');
      return firmResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    const result = await pool.query(
      `SELECT u.*, lf.firm_name, lf.firm_address, lf.license_number, lf.registration_status
       FROM users u
       LEFT JOIN law_firms lf ON u.id = lf.user_id
       WHERE u.email = $1`,
      [email]
    );
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Check if email exists
  static async emailExists(email) {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
  }

  // Check if firm name exists
  static async firmNameExists(firmName) {
    const result = await pool.query(
      'SELECT id FROM law_firms WHERE firm_name = $1',
      [firmName]
    );
    return result.rows.length > 0;
  }

  // Check if license number exists
  static async licenseNumberExists(licenseNumber) {
    const result = await pool.query(
      'SELECT id FROM law_firms WHERE license_number = $1',
      [licenseNumber]
    );
    return result.rows.length > 0;
  }
}

module.exports = User;