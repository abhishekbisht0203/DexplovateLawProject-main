const { pool } = require('../config/connectDB');
const bcrypt = require('bcryptjs');

// Database table name
const TABLE_NAME = 'users';

// Initialize the user table if it doesn't exist
const initUserTable = async () => {
    try {
        const client = await pool.connect();
        const query = `
            CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username VARCHAR(50) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                phone_number VARCHAR(15) UNIQUE NOT NULL,
                email_verified BOOLEAN DEFAULT FALSE,
                firm_details JSONB DEFAULT '{}',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await client.query(query);
        console.log(`Table '${TABLE_NAME}' initialized successfully`);
        client.release();
    } catch (err) {
        console.error(`Error initializing table '${TABLE_NAME}':`, err);
        throw err;
    }
};

const User = {
    // Create a new user
    createUser: async (userData) => {
        const { username, email, phoneNumber, password, email_verified } = userData;
        const password_hash = await bcrypt.hash(password, 12);
        const client = await pool.connect();
        try {
            const query = `
                INSERT INTO ${TABLE_NAME}(username, email, phone_number, password_hash, email_verified)
                VALUES($1, $2, $3, $4, $5)
                RETURNING id, username, email, phone_number, email_verified, firm_details;
            `;
            const values = [username, email.toLowerCase(), phoneNumber, password_hash, email_verified];
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (error) {
            // A specific error code for unique constraint violation in PostgreSQL
            if (error.code === '23505') {
                throw new Error('User with this email or phone number already exists.');
            }
            throw error; // Re-throw other errors
        } finally {
            client.release();
        }
    },

    // Get user by email
    getUserByEmail: async (email) => {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM ${TABLE_NAME} WHERE email = $1`,
                [email.toLowerCase()]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    },

    // Check if email exists
    emailExists: async (email) => {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT 1 FROM ${TABLE_NAME} WHERE email = $1 LIMIT 1`,
                [email.toLowerCase()]
            );
            return result.rows.length > 0;
        } finally {
            client.release();
        }
    },

    // Check if phone number exists
    phoneNumberExists: async (phoneNumber) => {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT 1 FROM ${TABLE_NAME} WHERE phone_number = $1 LIMIT 1`,
                [phoneNumber]
            );
            return result.rows.length > 0;
        } finally {
            client.release();
        }
    },

    // Check if firm name exists
    firmNameExists: async (firmName, userId = null) => {
        const client = await pool.connect();
        try {
            const query = `
                SELECT 1 FROM ${TABLE_NAME}
                WHERE firm_details ->> 'firm_name' = $1 AND id != $2
                LIMIT 1
            `;
            const values = [firmName, userId];
            const result = await client.query(query, values);
            return result.rows.length > 0;
        } finally {
            client.release();
        }
    },

    // Check if license number exists
    licenseNumberExists: async (licenseNumber, userId = null) => {
        const client = await pool.connect();
        try {
            const query = `
                SELECT 1 FROM ${TABLE_NAME}
                WHERE firm_details ->> 'license_number' = $1 AND id != $2
                LIMIT 1
            `;
            const values = [licenseNumber, userId];
            const result = await client.query(query, values);
            return result.rows.length > 0;
        } finally {
            client.release();
        }
    },
    
    // Complete firm registration
    completeFirmRegistration: async (userId, firmData) => {
        const client = await pool.connect();
        try {
            const firmDetails = {
                firm_name: firmData.firmName,
                firm_address: firmData.firmAddress,
                license_number: firmData.licenseNumber,
                registration_status: 'completed'
            };
            
            const query = `
                UPDATE ${TABLE_NAME}
                SET firm_details = $1, updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *;
            `;
            const result = await client.query(query, [firmDetails, userId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },
    
    // Get user by ID
    getUserById: async (userId) => {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM ${TABLE_NAME} WHERE id = $1`,
                [userId]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    }
};

module.exports = { User, initUserTable };
