document.addEventListener('DOMContentLoaded', function() {
  const appointmentForm = document.getElementById('appointmentForm');
  const notificationElement = document.getElementById('notification');
  const notificationMessage = document.getElementById('notificationMessage');
  
  // Show notification function
  function showNotification(message, isSuccess = true) {
    notificationMessage.textContent = message;
    notificationElement.className = isSuccess 
      ? 'notification show notification-success'
      : 'notification show notification-error';
    
    setTimeout(() => {
      notificationElement.className = 'notification';
    }, 5000);
  }
  
  // Form submission handler
  appointmentForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(appointmentForm);
    
    // Create appointment object
    const appointment = {
      fullName: formData.get('fullName'),
      contactNumber: formData.get('contactNumber'),
      email: formData.get('email'),
      service: formData.get('service'),
      date: formData.get('appointmentDate'),
      time: formData.get('appointmentTime'),
      notes: formData.get('notes') || '',
      createdAt: new Date().toISOString()
    };
    
    try {
      // First save to database
      const response = await fetch('/api/appointments/save.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to save appointment');
      }

      // If database save is successful, save to localStorage
      const xmlString = createAppointmentXML(appointment);
      saveAppointmentXML(xmlString);
      
      // Show success notification
      showNotification('Appointment Booked Successfully! We look forward to seeing you soon.');
      
      // Reset form
      appointmentForm.reset();
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      showNotification(error.message || 'Error Booking Appointment. Please try again later.', false);
    }
  });
  
  // Create XML string from appointment data
  function createAppointmentXML(appointment) {
    return `
<appointment>
  <fullName>${escapeXml(appointment.fullName)}</fullName>
  <contactNumber>${escapeXml(appointment.contactNumber)}</contactNumber>
  <email>${escapeXml(appointment.email)}</email>
  <service>${escapeXml(appointment.service)}</service>
  <date>${escapeXml(appointment.date)}</date>
  <time>${escapeXml(appointment.time)}</time>
  <notes>${escapeXml(appointment.notes)}</notes>
  <createdAt>${appointment.createdAt}</createdAt>
</appointment>
    `.trim();
  }
  
  // Save XML to localStorage
  function saveAppointmentXML(appointmentXml) {
    try {
      // Get existing appointments XML or create new one
      const existingXml = localStorage.getItem('appointmentsXML') || '<appointments></appointments>';
      
      // Parse existing XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(existingXml, 'application/xml');
      
      // Parse new appointment XML
      const newAppointmentDoc = parser.parseFromString(appointmentXml, 'application/xml');
      const newAppointmentNode = newAppointmentDoc.documentElement;
      
      // Import and append the new appointment node to the existing XML
      const importedNode = xmlDoc.importNode(newAppointmentNode, true);
      xmlDoc.documentElement.appendChild(importedNode);
      
      // Serialize back to string and save
      const serializer = new XMLSerializer();
      const updatedXmlString = serializer.serializeToString(xmlDoc);
      
      localStorage.setItem('appointmentsXML', updatedXmlString);
      
    } catch (error) {
      console.error('Error saving appointment XML:', error);
      throw error;
    }
  }
  
  // Helper function to escape XML special characters
  function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  
  // Date validation - disable past dates
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    
    dateInput.setAttribute('min', formattedToday);
  }
});
