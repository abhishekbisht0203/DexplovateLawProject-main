const { pool } = require('../config/connectDB');

/**
 * Handles all database interactions for cases.
 */
class Case {
  /**
   * Initializes the cases table in the database if it doesn't already exist.
   * This is a great practice to ensure your application can run without manual setup.
   */
  static async initCaseTable() {
    try {
      const client = await pool.connect();
      const query = `
        CREATE TABLE IF NOT EXISTS cases (
          id SERIAL PRIMARY KEY,
          client_name VARCHAR(255) NOT NULL,
          client_contact VARCHAR(255),
          case_type VARCHAR(255),
          involved_parties TEXT,
          case_description TEXT,
          filing_deadline DATE,
          court_date DATE,
          senior_lawyer VARCHAR(255),
          junior_lawyer VARCHAR(255),
          documents TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await client.query(query);
      console.log('Table \'cases\' initialized successfully.');
      client.release();
    } catch (err) {
      console.error('Error initializing table \'cases\':', err);
      throw err;
    }
  }

  /**
   * Creates a new case record in the database.
   * @param {object} caseData - The case data from the frontend form.
   * @param {string[]} filePaths - An array of file paths for the uploaded documents.
   * @returns {Promise<object>} The newly created case record.
   */
  static async create(caseData, filePaths) {
    const { 
      clientName, 
      clientContact, 
      caseType, 
      involvedParties, 
      caseDescription, 
      filingDeadline, 
      courtDate, 
      seniorLawyer, 
      juniorLawyer 
    } = caseData;

    const query = `
      INSERT INTO cases (
        client_name, 
        client_contact, 
        case_type, 
        involved_parties, 
        case_description, 
        filing_deadline, 
        court_date, 
        senior_lawyer, 
        junior_lawyer, 
        documents
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    
    const values = [
      clientName, 
      clientContact, 
      caseType, 
      involvedParties, 
      caseDescription, 
      filingDeadline, 
      courtDate, 
      seniorLawyer, 
      juniorLawyer, 
      filePaths // Storing the array of file paths
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error creating case:', err);
      throw new Error('Could not create case due to a database error.');
    }
  }

  /**
   * Finds a case record by its ID.
   * @param {number} id - The ID of the case to find.
   * @returns {Promise<object|null>} The case record or null if not found.
   */
  static async findById(id) {
    const query = 'SELECT * FROM cases WHERE id = $1;';
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error finding case:', err);
      throw new Error('Could not find case due to a database error.');
    }
  }

  /**
   * Updates an existing case record.
   * @param {number} id - The ID of the case to update.
   * @param {object} updatedData - The new data for the case.
   * @returns {Promise<object|null>} The updated case record or null if not found.
   */
  static async update(id, updatedData) {
    const {
      clientName, 
      clientContact, 
      caseType, 
      involvedParties, 
      caseDescription, 
      filingDeadline, 
      courtDate, 
      seniorLawyer, 
      juniorLawyer
    } = updatedData;

    const query = `
      UPDATE cases
      SET
        client_name = $1, 
        client_contact = $2, 
        case_type = $3, 
        involved_parties = $4, 
        case_description = $5, 
        filing_deadline = $6, 
        court_date = $7, 
        senior_lawyer = $8, 
        junior_lawyer = $9
      WHERE id = $10
      RETURNING *;
    `;
    const values = [
      clientName, 
      clientContact, 
      caseType, 
      involvedParties, 
      caseDescription, 
      filingDeadline, 
      courtDate, 
      seniorLawyer, 
      juniorLawyer,
      id
    ];
    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error updating case:', err);
      throw new Error('Could not update case due to a database error.');
    }
  }

  /**
   * Deletes a case record by its ID.
   * @param {number} id - The ID of the case to delete.
   * @returns {Promise<object|null>} The deleted case record or null if not found.
   */
  static async delete(id) {
    const query = 'DELETE FROM cases WHERE id = $1 RETURNING *;';
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error deleting case:', err);
      throw new Error('Could not delete case due to a database error.');
    }
  }
}

module.exports = { Case };
