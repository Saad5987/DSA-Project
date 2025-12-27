import sqlite3
import json
from datetime import datetime

def setup_database():
    """Initialize the database with sample data"""
    conn = sqlite3.connect('homes.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.executescript('''
    CREATE TABLE IF NOT EXISTS application (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        family_size INTEGER NOT NULL,
        income REAL NOT NULL,
        contact TEXT NOT NULL,
        email TEXT,
        address TEXT,
        status TEXT DEFAULT 'pending',
        priority_score INTEGER DEFAULT 0,
        applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        allocated_house_id INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS house (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        house_id TEXT UNIQUE NOT NULL,
        address TEXT NOT NULL,
        house_type TEXT NOT NULL,
        bedrooms INTEGER NOT NULL,
        size INTEGER NOT NULL,
        rent REAL NOT NULL,
        status TEXT DEFAULT 'available',
        current_occupant_id INTEGER,
        facilities TEXT,
        added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        email TEXT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS allocation_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        house_id INTEGER NOT NULL,
        allocated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        allocated_by TEXT,
        match_score INTEGER,
        FOREIGN KEY (application_id) REFERENCES application (id),
        FOREIGN KEY (house_id) REFERENCES house (id)
    );
    ''')
    
    # Insert sample admin
    cursor.execute('''
    INSERT OR IGNORE INTO admin (username, password_hash, full_name, email)
    VALUES (?, ?, ?, ?)
    ''', ('admin', 
          '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',  # sha256 of 'admin123'
          'System Administrator',
          'admin@homealloc.com'))
    
    # Insert sample houses
    sample_houses = [
        ('H-101', '123 Main Street, Karachi', 'apartment', 3, 1200, 15000, 'available'),
        ('H-102', '456 Park Road, Lahore', 'house', 4, 2000, 25000, 'available'),
        ('H-103', '789 Garden Avenue, Islamabad', 'duplex', 5, 2500, 35000, 'available'),
        ('H-104', '321 Market Street, Karachi', 'apartment', 2, 800, 10000, 'maintenance'),
        ('H-105', '654 Hill Road, Lahore', 'house', 3, 1500, 18000, 'available')
    ]
    
    cursor.executemany('''
    INSERT OR IGNORE INTO house (house_id, address, house_type, bedrooms, size, rent, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', sample_houses)
    
    # Insert sample applications
    sample_applications = [
        ('Ali Khan', 45, 6, 15000, '+923001234567', 'ali@example.com', 
         'Current Address, Karachi', 'approved', 92),
        ('Sara Ahmed', 38, 4, 12000, '+923001234568', 'sara@example.com',
         'Current Address, Lahore', 'pending', 85),
        ('Ahmed Raza', 50, 5, 10000, '+923001234569', 'ahmed@example.com',
         'Current Address, Islamabad', 'allocated', 95),
        ('Fatima Noor', 42, 3, 18000, '+923001234570', 'fatima@example.com',
         'Current Address, Karachi', 'reviewed', 78),
        ('Bilal Khan', 35, 7, 8000, '+923001234571', 'bilal@example.com',
         'Current Address, Lahore', 'approved', 98)
    ]
    
    cursor.executemany('''
    INSERT OR IGNORE INTO application (name, age, family_size, income, contact, email, address, status, priority_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_applications)
    
    conn.commit()
    conn.close()
    print("Database setup completed successfully!")

def create_config_file():
    """Create configuration file"""
    config = {
        "database": "homes.db",
        "secret_key": "your-secret-key-change-this",
        "debug": True,
        "host": "0.0.0.0",
        "port": 5000,
        "admin_username": "admin",
        "admin_default_password": "admin123"
    }
    
    with open('config.json', 'w') as f:
        json.dump(config, f, indent=4)
    
    print("Configuration file created!")

if __name__ == '__main__':
    print("Setting up HomeAlloc System...")
    setup_database()
    create_config_file()
    print("\nSetup completed! You can now run:")
    print("1. python app.py (for Flask backend)")
    print("2. javac HousingAllocationSystem.java && java HousingAllocationSystem (for Java DSA)")