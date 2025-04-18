
-- SQL Schema for Aesthetic Clinic Appointment System

-- Appointments Table
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100) NOT NULL,
  contactNumber VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  service VARCHAR(100) NOT NULL,
  appointmentDate DATE NOT NULL,
  appointmentTime VARCHAR(20) NOT NULL,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table (for service dropdown options)
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serviceName VARCHAR(100) NOT NULL,
  description TEXT,
  duration INT NOT NULL, -- Duration in minutes
  price DECIMAL(10,2) NOT NULL
);

-- Insert default services
INSERT INTO services (serviceName, description, duration, price) VALUES
('Facial Treatment', 'Rejuvenate your skin with our premium facial treatments', 60, 120.00),
('Botox', 'Reduce fine lines and wrinkles with our expert Botox procedures', 45, 350.00),
('Dermal Fillers', 'Restore volume and smooth away deeper lines with dermal fillers', 45, 400.00),
('Laser Hair Removal', 'Achieve smooth, hair-free skin with our advanced laser technology', 30, 200.00),
('Chemical Peel', 'Renew your skin with our effective chemical peel treatments', 45, 180.00),
('Microdermabrasion', 'Gentle exfoliation treatment for smoother, younger-looking skin', 30, 150.00),
('Lip Enhancement', 'Enhance your lips with our safe and natural-looking treatments', 30, 280.00),
('Eyebrow Microblading', 'Get perfect eyebrows with our semi-permanent makeup technique', 75, 250.00);
s
