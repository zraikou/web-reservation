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
  const editForm = document.getElementById('editForm');
  const editModal = document.getElementById('editModal');
  
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
      URL.revokeObjectURL(url);
      
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

  // Edit form submission
  editForm.addEventListener('submit', handleEditSubmit);
  
  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === editModal) {
      closeEditModal();
    }
  });
});

// Global variable to track sort state
let currentSort = {
  column: null,
  direction: 'asc'
};

// Function to sort appointments
function sortAppointments(appointments, column) {
  return [...appointments].sort((a, b) => {
    let aValue = a[column];
    let bValue = b[column];

    // Handle null/undefined values
    if (!aValue) aValue = '';
    if (!bValue) bValue = '';

    // Convert to lowercase for string comparison
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (column === 'appointmentDate') {
      // Convert dates to timestamps for comparison
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (currentSort.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

// Function to render appointments in table view
function renderTableView(appointments) {
  const tableContainer = document.getElementById('appointmentsTable');
  if (!appointments || appointments.length === 0) {
    tableContainer.innerHTML = '<p class="no-appointments">No appointments found</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th data-sort="fullName" class="sortable ${currentSort.column === 'fullName' ? currentSort.direction : ''}">Name</th>
        <th>Contact</th>
        <th>Email</th>
        <th data-sort="service" class="sortable ${currentSort.column === 'service' ? currentSort.direction : ''}">Service</th>
        <th data-sort="appointmentDate" class="sortable ${currentSort.column === 'appointmentDate' ? currentSort.direction : ''}">Date</th>
        <th>Time</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${appointments.map(appointment => `
        <tr>
          <td>${escapeHtml(appointment.fullName)}</td>
          <td>${escapeHtml(appointment.contactNumber)}</td>
          <td>${escapeHtml(appointment.email)}</td>
          <td>${escapeHtml(appointment.service)}</td>
          <td>${escapeHtml(appointment.appointmentDate)}</td>
          <td>${escapeHtml(appointment.appointmentTime)}</td>
          <td>
            <div class="action-buttons">
              <button type="button" class="btn-sm view-btn" onclick="openViewModal(${JSON.stringify(appointment).replace(/"/g, '&quot;')})">View</button>
              <button type="button" class="btn-sm edit-btn" onclick="openEditModal(${JSON.stringify(appointment).replace(/"/g, '&quot;')})">Edit</button>
              <button type="button" class="btn-sm delete-btn" onclick="deleteAppointment('${appointment.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  // Add click event listeners for sorting
  table.querySelectorAll('th.sortable').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const column = th.dataset.sort;
      if (currentSort.column === column) {
        // If clicking the same column, toggle direction
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        // If clicking a new column, set it with ascending direction
        currentSort.column = column;
        currentSort.direction = 'asc';
      }
      // Re-render with sorted data
      renderTableView(sortAppointments(appointments, column));
    });
  });

  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);
}

// Function to handle edit form submission
async function handleEditSubmit(event) {
  event.preventDefault();
  
  try {
    const formData = {
      id: document.getElementById('editId').value,
      fullName: document.getElementById('editFullName').value,
      contactNumber: document.getElementById('editContactNumber').value,
      email: document.getElementById('editEmail').value,
      service: document.getElementById('editService').value,
      appointmentDate: document.getElementById('editDate').value,
      appointmentTime: document.getElementById('editTime').value,
      notes: document.getElementById('editNotes').value
    };

    console.log('Sending update request with data:', formData); // Debug log

    // Send update request to server with the correct path
    const response = await fetch('/api/appointments/update.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    // Log the raw response for debugging
    const rawResponse = await response.text();
    console.log('Raw server response:', rawResponse);

    let result;
    try {
      result = JSON.parse(rawResponse);
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Server returned invalid JSON');
    }

    console.log('Parsed server response:', result); // Debug log

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to update appointment');
    }

    // Close modal
    document.getElementById('editModal').style.display = 'none';
    
    // Reload appointments to refresh the view
    await loadAppointments();
    showNotification('Appointment updated successfully');
    
  } catch (error) {
    console.error('Error updating appointment:', error);
    showNotification(error.message || 'Failed to update appointment', false);
  }
}

// Function to close edit modal
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

// Function to open edit modal
function openEditModal(appointment) {
  document.getElementById('editId').value = appointment.id;
  document.getElementById('editFullName').value = appointment.fullName;
  document.getElementById('editContactNumber').value = appointment.contactNumber;
  document.getElementById('editEmail').value = appointment.email;
  document.getElementById('editService').value = appointment.service;
  document.getElementById('editDate').value = appointment.appointmentDate;
  document.getElementById('editTime').value = appointment.appointmentTime;
  document.getElementById('editNotes').value = appointment.notes || '';
  
  document.getElementById('editModal').style.display = 'flex';
}

// Function to open view modal
function openViewModal(appointment) {
  document.getElementById('viewName').textContent = appointment.fullName;
  document.getElementById('viewService').textContent = appointment.service;
  document.getElementById('viewNotes').textContent = appointment.notes || 'No additional notes';
  
  document.getElementById('viewModal').style.display = 'flex';
}

// Function to close view modal
function closeViewModal() {
  document.getElementById('viewModal').style.display = 'none';
}

// Make these functions global so they can be called from HTML
window.openViewModal = openViewModal;
window.closeViewModal = closeViewModal;
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.deleteAppointment = deleteAppointment;
