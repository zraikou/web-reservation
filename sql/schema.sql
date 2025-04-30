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
  category VARCHAR(50) NOT NULL,
  serviceName VARCHAR(100) NOT NULL,
  description TEXT,
  duration INT NOT NULL, -- Duration in minutes
  regularPrice DECIMAL(10,2) NOT NULL,
  promoPrice DECIMAL(10,2) NOT NULL
);

-- Insert default services
-- Facial Treatments
INSERT INTO services (category, serviceName, description, duration, regularPrice, promoPrice) VALUES
('Facial Treatments', 'Hypoallergenic Facial', 'Gentle facial treatment for sensitive skin', 60, 549.00, 439.00),
('Facial Treatments', 'Premium Whitening Facial', 'Advanced whitening treatment for radiant skin', 60, 769.00, 615.00),
('Facial Treatments', 'Premium Age-Defy Facial', 'Anti-aging treatment to reduce fine lines', 60, 769.00, 615.00),
('Facial Treatments', 'Luxe Brightening Facial', 'Luxury brightening treatment for glowing skin', 60, 1099.00, 879.00),
('Facial Treatments', 'Luxe Acne-Clear Facial', 'Premium acne treatment for clear skin', 60, 1099.00, 879.00),
('Facial Treatments', 'Luxe Rejuvenation Facial', 'Luxury rejuvenation treatment for youthful skin', 60, 1099.00, 879.00),
('Facial Treatments', 'Hydra-Oxyderm Facial', 'Advanced hydration treatment', 60, 1759.00, 1407.00),
('Facial Treatments', 'Signature Golden Facial', 'Our signature premium facial treatment', 60, 1759.00, 1407.00);

-- Pico & Carbon Laser Treatments
INSERT INTO services (category, serviceName, description, duration, regularPrice, promoPrice) VALUES
('Pico & Carbon Laser', 'Acne Spot Pico Frosting', 'Targeted pico laser treatment for acne spots', 45, 1650.00, 1320.00),
('Pico & Carbon Laser', 'Black Doll Face', 'Carbon laser treatment for facial rejuvenation', 45, 2199.00, 1759.00),
('Pico & Carbon Laser', 'UA Carbon Laser Peel', 'Carbon laser peel for underarm area', 45, 2199.00, 1759.00),
('Pico & Carbon Laser', 'Black Carbon Laser Peel', 'Advanced carbon laser peel treatment', 45, 2199.00, 1759.00),
('Pico & Carbon Laser', 'Elbow Pico White', 'Pico laser treatment for elbow whitening', 45, 2199.00, 1759.00),
('Pico & Carbon Laser', 'Knee Carbon Peel', 'Carbon peel treatment for knee area', 45, 2199.00, 1759.00),
('Pico & Carbon Laser', 'Butt Carbon Peel', 'Carbon peel treatment for buttocks area', 45, 2750.00, 2200.00),
('Pico & Carbon Laser', 'Tattoo Laser Removal', 'Advanced laser treatment for tattoo removal', 45, 2199.00, 1759.00);

-- IV Treatments
INSERT INTO services (category, serviceName, description, duration, regularPrice, promoPrice) VALUES
('IV Treatments', 'Opal Teen', 'Youthful glow IV treatment', 60, 1200.00, 527.00),
('IV Treatments', 'Placenta', 'Rejuvenating placenta IV treatment', 60, 1099.00, 439.00),
('IV Treatments', 'Collagen', 'Collagen-boosting IV treatment', 60, 1099.00, 439.00),
('IV Treatments', 'Vitamin C', 'Vitamin C infusion treatment', 60, 1099.00, 439.00),
('IV Treatments', 'Vitamin B-Complex', 'Energy-boosting B-complex treatment', 60, 1099.00, 479.00),
('IV Treatments', 'Slimming L-Carnitine', 'Weight management IV treatment', 60, 1099.00, 479.00),
('IV Treatments', 'Topaz Ultra Detox', 'Advanced detoxification treatment', 60, 1400.00, 790.00),
('IV Treatments', 'Sapphire Bright', 'Brightening IV treatment', 60, 2600.00, 1119.00),
('IV Treatments', 'Ruby Rose White', 'Premium whitening IV treatment', 60, 3600.00, 1583.00),
('IV Treatments', 'Jade Anti-Aging', 'Anti-aging IV treatment', 60, 3800.00, 1671.00),
('IV Treatments', 'Diamond Clear', 'Premium skin clearing treatment', 60, 4000.00, 1759.00),
('IV Treatments', 'Emerald Premium', 'Premium rejuvenation treatment', 60, 4200.00, 1839.00),
('IV Treatments', 'Pearl White', 'Premium whitening treatment', 60, 4200.00, 1839.00),
('IV Treatments', 'Premium Golden White', 'Ultimate whitening treatment', 60, 10989.00, 8791.00);

-- Exiprolift Treatments
INSERT INTO services (category, serviceName, description, duration, regularPrice, promoPrice) VALUES
('Exiprolift Treatments', 'Face', 'Facial lifting treatment', 60, 2199.00, 1759.00),
('Exiprolift Treatments', 'Neck', 'Neck lifting treatment', 60, 1099.00, 879.00),
('Exiprolift Treatments', 'Arms', 'Arm lifting treatment', 60, 2749.00, 2199.00),
('Exiprolift Treatments', 'Abdomen', 'Abdominal lifting treatment', 60, 3849.00, 3079.00),
('Exiprolift Treatments', 'Back', 'Back lifting treatment', 60, 3849.00, 3079.00);

-- HIFU Treatments
INSERT INTO services (category, serviceName, description, duration, regularPrice, promoPrice) VALUES
('HIFU Treatments', 'Face + Neck (7D HIFU)', 'Advanced 7D HIFU treatment for face and neck', 90, 3959.00, 3167.00),
('HIFU Treatments', 'Face + Neck (Classic HIFU)', 'Classic HIFU treatment for face and neck', 90, 2749.00, 2199.00),
('HIFU Treatments', 'Whole Body (7D HIFU)', 'Complete body 7D HIFU treatment', 180, 31680.00, 25344.00),
('HIFU Treatments', 'Whole Body (Classic HIFU)', 'Complete body classic HIFU treatment', 180, 21999.00, 17599.00);
