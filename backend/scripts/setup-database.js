const { pool, createTables, insertSampleData } = require('../config/database');

const setupDatabase = async () => {
  try {
    console.log('Setting up Oriental Insurance database...');
    
    // Create tables
    await createTables();
    console.log('✅ Database tables created successfully');
    
    // Insert sample data
    await insertSampleData();
    console.log('✅ Sample data inserted successfully');
    
    console.log('🎉 Database setup completed!');
    
    // Close connection
    await pool.end();
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();
