// Houses Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sample houses data
    const houses = [
        {
            id: "H-101",
            address: "123 Main Street, Karachi",
            type: "apartment",
            bedrooms: 3,
            size: 1200,
            status: "available",
            occupant: null
        },
        {
            id: "H-102",
            address: "456 Park Road, Lahore",
            type: "house",
            bedrooms: 4,
            size: 2000,
            status: "occupied",
            occupant: "Ahmed Raza"
        },
        {
            id: "H-103",
            address: "789 Garden Avenue, Islamabad",
            type: "duplex",
            bedrooms: 5,
            size: 2500,
            status: "available",
            occupant: null
        },
        {
            id: "H-104",
            address: "321 Market Street, Karachi",
            type: "apartment",
            bedrooms: 2,
            size: 800,
            status: "maintenance",
            occupant: null
        },
        {
            id: "H-105",
            address: "654 Hill Road, Lahore",
            type: "house",
            bedrooms: 3,
            size: 1500,
            status: "available",
            occupant: null
        }
    ];

    const housesTable = document.getElementById('houses-table');
    const addHouseModal = document.getElementById('addHouseModal');
    const addHouseForm = document.getElementById('addHouseForm');

    // Function to render houses
    function renderHouses() {
        housesTable.innerHTML = '';
        
        houses.forEach(house => {
            const statusClass = `status-${house.status}`;
            const statusText = house.status.charAt(0).toUpperCase() + house.status.slice(1);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${house.id}</td>
                <td>${house.address}</td>
                <td>${house.type.charAt(0).toUpperCase() + house.type.slice(1)}</td>
                <td>${house.bedrooms}</td>
                <td>${house.size.toLocaleString()}</td>
                <td>
                    <span class="house-status ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td>${house.occupant || 'Vacant'}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewHouse('${house.id}')">View</button>
                    <button class="action-btn allocate-btn" onclick="editHouse('${house.id}')">Edit</button>
                    <button class="action-btn reject-btn" onclick="deleteHouse('${house.id}')" ${house.status === 'occupied' ? 'disabled' : ''}>Delete</button>
                </td>
            `;
            housesTable.appendChild(row);
        });
    }

    // Modal functions
    window.openAddHouseModal = function() {
        addHouseModal.style.display = 'block';
    };

    window.closeAddHouseModal = function() {
        addHouseModal.style.display = 'none';
        addHouseForm.reset();
    };

    // Add house form submission
    addHouseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newHouse = {
            id: document.getElementById('house-id').value,
            address: document.getElementById('house-address').value,
            type: document.getElementById('house-type').value,
            bedrooms: parseInt(document.getElementById('house-bedrooms').value),
            size: parseInt(document.getElementById('house-size').value),
            status: document.getElementById('house-status').value,
            occupant: null
        };

        // Add to houses array
        houses.push(newHouse);
        
        // Re-render table
        renderHouses();
        
        // Close modal and reset form
        closeAddHouseModal();
        
        alert(`House ${newHouse.id} has been added successfully!`);
    });

    // Global functions for action buttons
    window.viewHouse = function(houseId) {
        const house = houses.find(h => h.id === houseId);
        if (house) {
            alert(`House Details:\n\n` +
                  `ID: ${house.id}\n` +
                  `Address: ${house.address}\n` +
                  `Type: ${house.type}\n` +
                  `Bedrooms: ${house.bedrooms}\n` +
                  `Size: ${house.size.toLocaleString()} sqft\n` +
                  `Status: ${house.status}\n` +
                  `Occupant: ${house.occupant || 'Vacant'}`);
        }
    };

    window.editHouse = function(houseId) {
        const house = houses.find(h => h.id === houseId);
        if (house) {
            if (confirm(`Edit house ${houseId}?`)) {
                // In real app, this would open an edit form
                alert(`Edit functionality for house ${houseId} would open here.`);
            }
        }
    };

    window.deleteHouse = function(houseId) {
        const index = houses.findIndex(h => h.id === houseId);
        if (index !== -1) {
            if (confirm(`Delete house ${houseId}? This action cannot be undone.`)) {
                houses.splice(index, 1);
                renderHouses();
                alert(`House ${houseId} has been deleted.`);
            }
        }
    };

    // Initial render
    renderHouses();

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addHouseModal) {
            closeAddHouseModal();
        }
    });
});