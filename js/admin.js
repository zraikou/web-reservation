// Global function for delete
async function deleteAppointment(id) {
  if (confirm('Are you sure you want to delete this appointment?')) {
    try {
      // Send delete request to server
      const response = await fetch('/api/appointments/delete.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      // Reload appointments to refresh the view
      await loadAppointments();
      showNotification('Appointment deleted successfully');
      
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showNotification('Failed to delete appointment', false);
    }
  }
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper function to show notifications
function showNotification(message, isSuccess = true) {
  const notificationElement = document.getElementById('notification');
  const notificationMessage = document.getElementById('notificationMessage');
  
  notificationMessage.textContent = message;
  notificationElement.className = isSuccess 
    ? 'notification show notification-success'
    : 'notification show notification-error';
  
  setTimeout(() => {
    notificationElement.className = 'notification';
  }, 5000);
}

// Function to load appointments from database
async function loadAppointments() {
  try {
    // First load from database
    const response = await fetch('/api/appointments/get.php');
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    
    // Get appointments from the response
    const appointments = result.appointments;
    
    // Convert database appointments to XML format for local storage
    const xmlDoc = document.implementation.createDocument(null, "appointments");
    
    appointments.forEach(appointment => {
      const appointmentNode = xmlDoc.createElement("appointment");
      
      const fields = {
        fullName: appointment.fullName,
        contactNumber: appointment.contactNumber,
        email: appointment.email,
        service: appointment.service,
        date: appointment.appointmentDate,
        time: appointment.appointmentTime,
        notes: appointment.notes || '',
        createdAt: appointment.createdAt
      };
      
      for (const [key, value] of Object.entries(fields)) {
        const element = xmlDoc.createElement(key);
        element.textContent = value;
        appointmentNode.appendChild(element);
      }
      
      xmlDoc.documentElement.appendChild(appointmentNode);
    });
    
    // Save to local storage
    const serializer = new XMLSerializer();
    localStorage.setItem('appointmentsXML', serializer.serializeToString(xmlDoc));
    
    // Filter appointments if search term exists
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredAppointments = appointments.filter(appointment => {
      return (
        appointment.fullName.toLowerCase().includes(searchTerm) ||
        appointment.email.toLowerCase().includes(searchTerm) ||
        appointment.service.toLowerCase().includes(searchTerm)
      );
    });
    
    renderTableView(filteredAppointments);
    
  } catch (error) {
    console.error('Error loading appointments:', error);
    showNotification('Error loading appointments', false);
  }
}

// Handle XML import
document.getElementById('importXMLBtn').addEventListener('click', function() {
    document.getElementById('importXML').click();
});

document.getElementById('importXML').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        handleXMLImport(file);
    }
});

async function handleXMLImport(file) {
    try {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                const xmlString = e.target.result;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
                
                // Validate XML structure
                if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                    throw new Error('Invalid XML format');
                }
                
                // Send XML to server for database import
                const response = await fetch('/api/appointments/import.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/xml',
                    },
                    body: xmlString
                });

                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.message);
                }

                // If import was successful, update localStorage
                localStorage.setItem('appointmentsXML', xmlString);
                
                // Reload appointments to refresh the view
                await loadAppointments();
                
                showNotification(result.message);
                
                // Clear the file input
                document.getElementById('importXML').value = '';
                
            } catch (error) {
                console.error('Error processing XML:', error);
                showNotification(error.message || 'Error processing XML file', false);
            }
        };
        
        reader.readAsText(file);
        
    } catch (error) {
        console.error('Error reading file:', error);
        showNotification('Error reading file', false);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const searchInput = document.getElementById('searchInput');
  const exportXMLBtn = document.getElementById('exportXML');
  const exportExcelBtn = document.getElementById('exportExcel');
  const clearAppointmentsBtn = document.getElementById('clearAppointments');
  
  // Load appointments on page load
  loadAppointments();
  
  // Search functionality
  searchInput.addEventListener('input', loadAppointments);
  
  // Export XML button
  exportXMLBtn.addEventListener('click', () => {
    try {
      const xmlData = localStorage.getItem('appointmentsXML') || '<appointments></appointments>';
      const blob = new Blob([xmlData], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments_${new Date().toISOString().split('T')[0]}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      showNotification('XML Downloaded Successfully');
    } catch (error) {
      console.error('Error downloading XML:', error);
      showNotification('Download Failed', false);
    }
  });

  // Export Excel button
  exportExcelBtn.addEventListener('click', async () => {
    try {
      // Fetch current appointments from database
      const response = await fetch('/api/appointments/get.php');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      const appointments = result.appointments;

      // Format data for Excel
      const excelData = appointments.map(appointment => ({
        'Name': appointment.fullName,
        'Contact Number': appointment.contactNumber,
        'Email': appointment.email,
        'Service': appointment.service,
        'Date': appointment.appointmentDate,
        'Time': appointment.appointmentTime,
        'Notes': appointment.notes || ''
      }));

      // Create workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');

      // Auto-size columns
      const maxWidths = {};
      excelData.forEach(row => {
        Object.keys(row).forEach(key => {
          const value = String(row[key] || '');
          maxWidths[key] = Math.max(maxWidths[key] || key.length, value.length);
        });
      });

      worksheet['!cols'] = Object.keys(maxWidths).map(key => ({ wch: maxWidths[key] + 2 }));

      // Save file
      XLSX.writeFile(workbook, `appointments_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      showNotification('Excel File Downloaded Successfully');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      showNotification('Excel Export Failed', false);
    }
  });
  
  // Clear appointments button
  clearAppointmentsBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete all appointments? This cannot be undone.')) {
      try {
        const response = await fetch('/api/appointments/clear.php', {
          method: 'POST'
        });
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        localStorage.setItem('appointmentsXML', '<appointments></appointments>');
        await loadAppointments();
        showNotification('All Appointments Deleted');
      } catch (error) {
        console.error('Error clearing appointments:', error);
        showNotification('Failed to clear appointments', false);
      }
    }
  });
});

// Function to render the table view
function renderTableView(appointments) {
  const appointmentsTable = document.getElementById('appointmentsTable');
  
  if (appointments.length === 0) {
    appointmentsTable.innerHTML = `
      <p class="text-center py-4">No appointments found</p>
      ${document.getElementById('searchInput').value ? '<button class="btn btn-link clear-search">Clear search</button>' : ''}
    `;
    
    const clearSearchBtn = appointmentsTable.querySelector('.clear-search');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        loadAppointments();
      });
    }
    
    return;
  }
  
  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th class="sortable" data-sort="fullName">Name <span class="sort-icon">↕</span></th>
          <th>Contact</th>
          <th>Email</th>
          <th class="sortable" data-sort="service">Service <span class="sort-icon">↕</span></th>
          <th class="sortable" data-sort="appointmentDate">Date <span class="sort-icon">↕</span></th>
          <th>Time</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  appointments.forEach((appointment) => {
    tableHTML += `
      <tr data-id="${appointment.id}">
        <td>${escapeHtml(appointment.fullName)}</td>
        <td>${escapeHtml(appointment.contactNumber)}</td>
        <td>${escapeHtml(appointment.email)}</td>
        <td>${escapeHtml(appointment.service)}</td>
        <td>${escapeHtml(appointment.appointmentDate)}</td>
        <td>${escapeHtml(appointment.appointmentTime)}</td>
        <td class="action-buttons">
          <button class="btn btn-sm delete-btn" onclick="deleteAppointment(${appointment.id})">Delete</button>
        </td>
      </tr>
    `;
  });
  
  tableHTML += `
      </tbody>
    </table>
  `;
  
  appointmentsTable.innerHTML = tableHTML;
  
  // Store original order of appointments
  const originalOrder = [...appointments];
  
  // Add sorting functionality only to sortable headers
  const sortableHeaders = appointmentsTable.querySelectorAll('.sortable');
  sortableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const sortField = header.dataset.sort;
      const currentOrder = header.dataset.order || '';
      
      // Reset all other headers
      sortableHeaders.forEach(h => {
        if (h !== header) {
          h.dataset.order = '';
          h.querySelector('.sort-icon').textContent = '↕';
        }
      });
      
      // Cycle through: ascending -> descending -> default
      let newOrder;
      if (currentOrder === '') {
        newOrder = 'asc';
      } else if (currentOrder === 'asc') {
        newOrder = 'desc';
      } else {
        // Reset to default order
        appointments.splice(0, appointments.length, ...originalOrder);
        header.dataset.order = '';
        header.querySelector('.sort-icon').textContent = '↕';
        renderTableView(appointments);
        return;
      }
      
      // Update clicked header
      header.dataset.order = newOrder;
      header.querySelector('.sort-icon').textContent = newOrder === 'asc' ? '↑' : '↓';
      
      // Sort the appointments
      appointments.sort((a, b) => {
        let comparison = 0;
        if (sortField === 'appointmentDate') {
          comparison = new Date(a[sortField]) - new Date(b[sortField]);
        } else {
          comparison = String(a[sortField]).localeCompare(String(b[sortField]));
        }
        return newOrder === 'asc' ? comparison : -comparison;
      });
      
      renderTableView(appointments);
    });
  });
}
