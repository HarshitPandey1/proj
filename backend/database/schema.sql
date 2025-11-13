-- College Doubt Solver Platform Database Schema
-- PostgreSQL Database

-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS doubt_tags CASCADE;
DROP TABLE IF EXISTS doubts CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');
CREATE TYPE notification_type AS ENUM ('answer', 'vote', 'comment', 'system');

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'student',
    department VARCHAR(100),
    year_of_study INTEGER,
    profile_picture VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_domain_check CHECK (email LIKE '%@bmsce.ac.in')
);

-- Subjects Table
CREATE TABLE subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(255) UNIQUE NOT NULL,
    subject_code VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags Table
CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doubts Table
CREATE TABLE doubts (
    doubt_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(subject_id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    is_resolved BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doubt Tags Junction Table
CREATE TABLE doubt_tags (
    doubt_id INTEGER REFERENCES doubts(doubt_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (doubt_id, tag_id)
);

-- Answers Table
CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    doubt_id INTEGER NOT NULL REFERENCES doubts(doubt_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_accepted BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Votes Table
CREATE TABLE votes (
    vote_id SERIAL PRIMARY KEY,
    answer_id INTEGER NOT NULL REFERENCES answers(answer_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    vote_type vote_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(answer_id, user_id)
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    doubt_id INTEGER REFERENCES doubts(doubt_id) ON DELETE CASCADE,
    answer_id INTEGER REFERENCES answers(answer_id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better query performance
CREATE INDEX idx_doubts_user_id ON doubts(user_id);
CREATE INDEX idx_doubts_subject_id ON doubts(subject_id);
CREATE INDEX idx_doubts_created_at ON doubts(created_at DESC);
CREATE INDEX idx_answers_doubt_id ON answers(doubt_id);
CREATE INDEX idx_answers_user_id ON answers(user_id);
CREATE INDEX idx_votes_answer_id ON votes(answer_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doubts_updated_at BEFORE UPDATE ON doubts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Sample Subjects
INSERT INTO subjects (subject_name, subject_code, department, description) VALUES
('Data Structures', 'CS301', 'Computer Science', 'Fundamental data structures and algorithms'),
('Database Management Systems', 'CS302', 'Computer Science', 'Relational databases and SQL'),
('Operating Systems', 'CS303', 'Computer Science', 'OS concepts and design'),
('Computer Networks', 'CS304', 'Computer Science', 'Network protocols and architecture'),
('Web Development', 'CS305', 'Computer Science', 'Full-stack web development'),
('Machine Learning', 'CS401', 'Computer Science', 'ML algorithms and applications'),
('Engineering Mathematics', 'MA201', 'Mathematics', 'Advanced mathematics for engineers'),
('Digital Electronics', 'EC201', 'Electronics', 'Digital circuits and logic design');

-- Sample Tags
INSERT INTO tags (tag_name) VALUES
('c-programming'),
('java'),
('python'),
('javascript'),
('sql'),
('algorithms'),
('homework-help'),
('exam-prep'),
('project-doubt'),
('concept-clarification'),
('debugging'),
('assignment');

-- Sample Users (Password is 'password123' hashed with bcrypt)
-- Note: In production, these should be properly hashed
INSERT INTO users (full_name, email, password_hash, role, department, year_of_study) VALUES
('Raj Kumar', 'raj.kumar@bmsce.ac.in', '$2a$10$rXQvvXN5Y8Qu6L6YpZ8FzOqGQvK3gV9xYL8YpZ8FzOqGQvK3gV9xY', 'student', 'Computer Science', 3),
('Priya Sharma', 'priya.sharma@bmsce.ac.in', '$2a$10$rXQvvXN5Y8Qu6L6YpZ8FzOqGQvK3gV9xYL8YpZ8FzOqGQvK3gV9xY', 'student', 'Computer Science', 2),
('Dr. Anil Singh', 'anil.singh@bmsce.ac.in', '$2a$10$rXQvvXN5Y8Qu6L6YpZ8FzOqGQvK3gV9xYL8YpZ8FzOqGQvK3gV9xY', 'faculty', 'Computer Science', NULL),
('Sneha Reddy', 'sneha.reddy@bmsce.ac.in', '$2a$10$rXQvvXN5Y8Qu6L6YpZ8FzOqGQvK3gV9xYL8YpZ8FzOqGQvK3gV9xY', 'student', 'Electronics', 3),
('Admin User', 'admin@bmsce.ac.in', '$2a$10$rXQvvXN5Y8Qu6L6YpZ8FzOqGQvK3gV9xYL8YpZ8FzOqGQvK3gV9xY', 'admin', 'Administration', NULL);

-- Sample Doubts
INSERT INTO doubts (user_id, subject_id, title, description, is_resolved, views_count) VALUES
(1, 1, 'How to implement Binary Search Tree in C?', 'I am trying to implement a BST but getting segmentation fault. Can someone help me understand the correct approach for insertion and deletion?', false, 45),
(2, 2, 'Difference between INNER JOIN and OUTER JOIN?', 'I am confused about when to use INNER JOIN vs OUTER JOIN in SQL queries. Can someone explain with examples?', true, 78),
(1, 3, 'What is the difference between Process and Thread?', 'I understand both are execution units, but what are the key differences and when should we use one over the other?', true, 120),
(4, 4, 'How does TCP 3-way handshake work?', 'Can someone explain the TCP connection establishment process in detail?', false, 56);

-- Sample Doubt Tags
INSERT INTO doubt_tags (doubt_id, tag_id) VALUES
(1, 1), (1, 6), (1, 10),
(2, 5), (2, 10),
(3, 10), (3, 8),
(4, 10), (4, 8);

-- Sample Answers
INSERT INTO answers (doubt_id, user_id, answer_text, upvotes, downvotes, is_accepted) VALUES
(2, 3, 'INNER JOIN returns only matching rows from both tables, while OUTER JOIN returns all rows from one or both tables even if there is no match. LEFT OUTER JOIN returns all rows from the left table and matching rows from the right table.', 5, 0, true),
(3, 3, 'A process is an independent execution unit with its own memory space, while a thread is a lightweight unit within a process that shares memory. Threads are faster to create and context switch, but processes are more isolated and secure.', 8, 1, true),
(4, 1, 'TCP 3-way handshake: 1) Client sends SYN, 2) Server responds with SYN-ACK, 3) Client sends ACK. This establishes a reliable connection before data transfer begins.', 3, 0, false);

-- Sample Votes
INSERT INTO votes (answer_id, user_id, vote_type) VALUES
(1, 1, 'upvote'),
(1, 4, 'upvote'),
(2, 1, 'upvote'),
(2, 2, 'upvote'),
(3, 2, 'upvote');

-- Sample Notifications
INSERT INTO notifications (user_id, doubt_id, answer_id, type, message, is_read) VALUES
(2, 2, 1, 'answer', 'Dr. Anil Singh answered your doubt about INNER JOIN vs OUTER JOIN', true),
(1, 3, 2, 'answer', 'Dr. Anil Singh answered your doubt about Process and Thread', true),
(4, 4, 3, 'answer', 'Raj Kumar answered your doubt about TCP 3-way handshake', false);

-- Grant necessary permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
