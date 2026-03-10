  // Data storage
        let laptops = JSON.parse(localStorage.getItem('laptops')) || [];
        let currentLaptopId = null;
        
        // Show selected section
        function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(sectionId).style.display = 'block';
            
            if (sectionId === 'display') {
                displayLaptops();
            }
        }
        
        // Add a new laptop
        function addLaptop() {
            const name = document.getElementById('name').value;
            const laptopType = document.getElementById('laptopType').value;
            const serialNo = document.getElementById('serialNo').value;
            const registerId = document.getElementById('registerId').value;
            const registeredDate = document.getElementById('registeredDate').value;
            const studentId = document.getElementById('studentId').value;
            const department = document.getElementById('department').value;
            const phoneNo = document.getElementById('phoneNo').value;
            const laptopIdentification = document.getElementById('laptopIdentification').value;
            
            // Validate required fields
            if (!name || !serialNo || !studentId) {
                showMessage('addMessage', 'Please fill in all required fields', 'error');
                return;
            }
            
            // Check if serial number already exists
            if (laptops.some(laptop => laptop.serialNo === serialNo)) {
                showMessage('addMessage', 'A laptop with this serial number is already registered!', 'warning');
                return;
            }
            
            // Add new laptop
            const newLaptop = {
                id: Date.now(), // unique ID
                name,
                laptopType,
                serialNo,
                registerId,
                registeredDate,
                studentId,
                department,
                phoneNo,
                laptopIdentification
            };
            
            laptops.push(newLaptop);
            localStorage.setItem('laptops', JSON.stringify(laptops));
            
            showMessage('addMessage', 'Laptop registered successfully!', 'success');
            clearForm();
        }
        
        // Clear the form
        function clearForm() {
            document.getElementById('name').value = '';
            document.getElementById('laptopType').value = '';
            document.getElementById('serialNo').value = '';
            document.getElementById('registerId').value = '';
            document.getElementById('registeredDate').value = '';
            document.getElementById('studentId').value = '';
            document.getElementById('department').value = '';
            document.getElementById('phoneNo').value = '';
            document.getElementById('laptopIdentification').value = 'P';
        }
        
        // Display all laptops
        function displayLaptops() {
            const tableBody = document.querySelector('#laptopsTable tbody');
            tableBody.innerHTML = '';
            
            if (laptops.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No laptops registered yet</td></tr>';
                return;
            }
            
            laptops.forEach(laptop => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${laptop.name}</td>
                    <td>${laptop.laptopType}</td>
                    <td>${laptop.serialNo}</td>
                    <td>${laptop.studentId}</td>
                    <td>${laptop.department}</td>
                    <td>${laptop.registeredDate}</td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        // Find laptop for update/delete
        function findLaptop() {
            const serialNo = document.getElementById('searchSerial').value;
            const laptop = laptops.find(l => l.serialNo === serialNo);
            
            if (!laptop) {
                showMessage('updateMessage', 'No laptop found with this serial number', 'error');
                return;
            }
            
            // Show the update form
            document.getElementById('updateForm').style.display = 'block';
            
            // Populate the form
            document.getElementById('updateName').value = laptop.name;
            document.getElementById('updateLaptopType').value = laptop.laptopType;
            document.getElementById('updateSerialNo').value = laptop.serialNo;
            document.getElementById('updateRegisterId').value = laptop.registerId;
            document.getElementById('updateRegisteredDate').value = laptop.registeredDate;
            document.getElementById('updateStudentId').value = laptop.studentId;
            document.getElementById('updateDepartment').value = laptop.department;
            document.getElementById('updatePhoneNo').value = laptop.phoneNo;
            document.getElementById('updateLaptopIdentification').value = laptop.laptopIdentification;
            
            currentLaptopId = laptop.id;
            showMessage('updateMessage', 'Laptop found. You can now update or delete the registration.', 'success');
        }
        
        // Update laptop registration
        function updateLaptop() {
            if (!currentLaptopId) return;
            
            const index = laptops.findIndex(l => l.id === currentLaptopId);
            if (index === -1) return;
            
            // Update the laptop data
            laptops[index] = {
                id: currentLaptopId,
                name: document.getElementById('updateName').value,
                laptopType: document.getElementById('updateLaptopType').value,
                serialNo: document.getElementById('updateSerialNo').value,
                registerId: document.getElementById('updateRegisterId').value,
                registeredDate: document.getElementById('updateRegisteredDate').value,
                studentId: document.getElementById('updateStudentId').value,
                department: document.getElementById('updateDepartment').value,
                phoneNo: document.getElementById('updatePhoneNo').value,
                laptopIdentification: document.getElementById('updateLaptopIdentification').value
            };
            
            localStorage.setItem('laptops', JSON.stringify(laptops));
            showMessage('updateMessage', 'Laptop registration updated successfully!', 'success');
            
            // Reset the form
            document.getElementById('searchSerial').value = '';
            document.getElementById('updateForm').style.display = 'none';
            currentLaptopId = null;
        }
        
        // Delete laptop registration
        function deleteLaptop() {
            if (!currentLaptopId) return;
            
            if (!confirm('Are you sure you want to delete this registration?')) return;
            
            laptops = laptops.filter(l => l.id !== currentLaptopId);
            localStorage.setItem('laptops', JSON.stringify(laptops));
            showMessage('updateMessage', 'Laptop registration deleted successfully!', 'success');
            
            // Reset the form
            document.getElementById('searchSerial').value = '';
            document.getElementById('updateForm').style.display = 'none';
            currentLaptopId = null;
        }
        
        // Search laptops
        function searchLaptops() {
            const query = document.getElementById('searchQuery').value.toLowerCase();
            const results = laptops.filter(laptop => 
                laptop.serialNo.toLowerCase().includes(query) ||
                laptop.name.toLowerCase().includes(query) ||
                laptop.studentId.toLowerCase().includes(query)
            );
            
            const tableBody = document.querySelector('#searchResults tbody');
            tableBody.innerHTML = '';
            
            if (results.length === 0) {
                showMessage('searchMessage', 'No matching laptops found', 'warning');
                return;
            }
            
            results.forEach(laptop => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${laptop.name}</td>
                    <td>${laptop.laptopType}</td>
                    <td>${laptop.serialNo}</td>
                    <td>${laptop.studentId}</td>
                    <td>${laptop.department}</td>
                    <td>${laptop.registeredDate}</td>
                `;
                tableBody.appendChild(row);
            });
            
            showMessage('searchMessage', `Found ${results.length} matching laptop(s)`, 'success');
        }
        
        // Show message
        function showMessage(elementId, message, type) {
            const messageElement = document.getElementById(elementId);
            messageElement.textContent = message;
            messageElement.className = `message ${type}`;
            
            // Clear message after 5 seconds
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'message';
            }, 5000);
        }
        
        // Initialize the page
        window.onload = function() {
            displayLaptops();
        };