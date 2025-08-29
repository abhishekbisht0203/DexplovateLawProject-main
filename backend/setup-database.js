const fs = require('fs');
const path = require('path');
const pool = require('./config/database');

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully');
    console.log('📊 Tables created: users, law_firms');
    console.log('🔍 Indexes created for optimal performance');
    console.log('⚡ Triggers added for automatic timestamp updates');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();