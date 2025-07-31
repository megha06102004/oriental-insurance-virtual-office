const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'oriental_insurance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database schema
const createTables = async () => {
  try {
    const connection = await pool.getConnection();

    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('customer', 'agent', 'admin') DEFAULT 'customer',
        address JSON,
        preferences JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // Policies table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS policies (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        policy_number VARCHAR(50) UNIQUE NOT NULL,
        policy_type ENUM('motor', 'health', 'home', 'travel') NOT NULL,
        premium_amount DECIMAL(10, 2) NOT NULL,
        coverage_amount DECIMAL(12, 2) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
        vehicle_details JSON,
        health_details JSON,
        home_details JSON,
        travel_details JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Claims table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS claims (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        policy_id VARCHAR(36),
        claim_number VARCHAR(50) UNIQUE NOT NULL,
        claim_type VARCHAR(50) NOT NULL,
        claim_amount DECIMAL(10, 2),
        approved_amount DECIMAL(10, 2),
        incident_date DATE NOT NULL,
        incident_description TEXT,
        status ENUM('submitted', 'under_review', 'approved', 'rejected', 'settled') DEFAULT 'submitted',
        documents JSON,
        timeline JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
      )
    `);

    // Grievances table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS grievances (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        ticket_number VARCHAR(50) UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
        assigned_to VARCHAR(255),
        resolution TEXT,
        attachments JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Chat sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        session_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Notifications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
        read_status BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Audit logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(36),
        old_values JSON,
        new_values JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    connection.release();
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
};

// Insert sample data
const insertSampleData = async () => {
  try {
    const connection = await pool.getConnection();

    // Insert sample user
    await connection.execute(`
      INSERT IGNORE INTO users (id, email, password, name, phone, role, address, preferences) 
      VALUES (
        'user1',
        'demo@oriental.co.in',
        '$2a$10$XYZ123...',
        'Demo User',
        '+91-9876543210',
        'customer',
        JSON_OBJECT('street', '123 Main Street', 'city', 'Mumbai', 'state', 'Maharashtra', 'pincode', '400001', 'country', 'India'),
        JSON_OBJECT('language', 'English', 'notifications', true, 'newsletter', true)
      )
    `);

    // Insert sample policy
    await connection.execute(`
      INSERT IGNORE INTO policies (id, user_id, policy_number, policy_type, premium_amount, coverage_amount, start_date, end_date, vehicle_details)
      VALUES (
        'pol1',
        'user1',
        'POL001',
        'motor',
        15000.00,
        500000.00,
        '2024-01-01',
        '2024-12-31',
        JSON_OBJECT('make', 'Maruti Suzuki', 'model', 'Swift', 'year', 2022, 'registrationNumber', 'MH01AB1234')
      )
    `);

    // Insert sample claim
    await connection.execute(`
      INSERT IGNORE INTO claims (id, user_id, policy_id, claim_number, claim_type, claim_amount, incident_date, incident_description, documents)
      VALUES (
        'clm1',
        'user1',
        'pol1',
        'CLM001',
        'Accident',
        25000.00,
        '2024-01-10',
        'Minor accident at traffic signal',
        JSON_ARRAY('fir_copy.pdf', 'damage_photos.jpg', 'repair_estimate.pdf')
      )
    `);

    connection.release();
    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

module.exports = {
  pool,
  createTables,
  insertSampleData,
  testConnection
};
