-- Create database
CREATE DATABASE legalmentor;

-- Connect to the database
\c legalmentor;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('lawyer', 'client', 'admin')),
    phone VARCHAR(20),
    company VARCHAR(255),
    specialization VARCHAR(255),
    bar_number VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cases table
CREATE TABLE cases (
    id SERIAL PRIMARY KEY,
    case_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'completed', 'on-hold', 'archived')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    category VARCHAR(100),
    court VARCHAR(255),
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_hearing TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) CHECK (activity_type IN ('meeting', 'call', 'document', 'court', 'research', 'email')),
    case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_at TIMESTAMP,
    duration INTEGER, -- in minutes
    billable BOOLEAN DEFAULT FALSE
);

-- Appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    appointment_type VARCHAR(50) CHECK (appointment_type IN ('meeting', 'court', 'call', 'consultation', 'deposition')),
    client_id INTEGER REFERENCES users(id),
    case_id INTEGER REFERENCES cases(id),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    client_id INTEGER REFERENCES users(id) NOT NULL,
    case_id INTEGER REFERENCES cases(id),
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time entries table
CREATE TABLE time_entries (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES cases(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration INTEGER NOT NULL, -- in minutes
    hourly_rate DECIMAL(8,2),
    billable BOOLEAN DEFAULT TRUE,
    invoiced BOOLEAN DEFAULT FALSE,
    invoice_id INTEGER REFERENCES invoices(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cases_client_id ON cases(client_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_documents_case_id ON documents(case_id);
CREATE INDEX idx_activities_case_id ON activities(case_id);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_time_entries_case_id ON time_entries(case_id);

-- Insert sample data
INSERT INTO users (name, email, password_hash, account_type, specialization, bar_number) VALUES
('John Lawyer', 'lawyer@example.com', '$2b$12$example_hash', 'lawyer', 'Corporate Law', 'BAR123456'),
('Jane Client', 'client@example.com', '$2b$12$example_hash', 'client', NULL, NULL),
('Admin User', 'admin@example.com', '$2b$12$example_hash', 'admin', NULL, NULL);
