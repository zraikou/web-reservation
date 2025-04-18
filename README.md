
# Aesthetic Clinic Appointment System

This is a modern and visually appealing website for an Aesthetic Clinic Appointment System that allows clients to book appointments online and record their details using XML and XSLT.

## Features

- Homepage with clinic information and services
- Booking form for clients to schedule appointments
- Admin page that displays all bookings using XSLT transformation
- XML data storage
- Responsive design with a calming aesthetic

## Technologies Used

- HTML5 for structure
- CSS3 for styling
- JavaScript for interactivity
- XML for data storage
- XSLT for XML transformation
- PHP & SQL (ready for database integration)

## Setup Instructions

### Local Development Setup

1. Clone this repository to your local machine
2. Use a web server like XAMPP, WAMP, or a simple PHP server to serve the files
3. Open the index.html file in your browser

### Database Setup (Optional)

If you want to use the SQL database instead of localStorage:

1. Create a MySQL database named `aesthetic_clinic`
2. Import the `sql/schema.sql` file to set up the tables
3. Update the database credentials in `db.php`
4. Modify the JavaScript code to use the PHP API endpoints instead of localStorage

## File Structure

- `index.html` - Homepage
- `booking.html` - Appointment booking page
- `admin.html` - Admin dashboard for viewing appointments
- `css/styles.css` - Main stylesheet
- `js/` - JavaScript files
- `appointments.xsl` - XSLT stylesheet for transforming XML
- `sql/schema.sql` - SQL database schema
- `db.php` - PHP database connection and functions
- `api.php` - PHP API endpoints

## Extending the Application

To extend this application:

1. Add user authentication for the admin area
2. Implement email notifications for appointment confirmations
3. Add appointment management features (edit/delete)
4. Implement a calendar view for appointments

## Credits

- Font: Playfair Display and Roboto from Google Fonts
