// Allocation System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const eligibleApplications = [
        {
            id: "APP-001",
            name: "Ali Khan",
            familySize: 6,
            income: 15000,
            priority: 1,
            needs: "4+ bedrooms, ground floor preferred",
            appliedDate: "2025-03-10"
        },
        {
            id: "APP-005",
            name: "Bilal Khan",
            familySize: 7,
            income: 8000,
            priority: 1,
            needs: "Large house, 5+ bedrooms",
            appliedDate: "2025-03-13"
        },
        {
            id: "APP-002",
            name: "Sara Ahmed",
            familySize: 4,
            income: 12000,
            priority: 2,
            needs: "3-4 bedrooms, near school",
            appliedDate: "2025-03-12"
        }
    ];

    const availableHouses = [
        {
            id: "H-101",
            address: "123 Main Street, Karachi",
            bedrooms: 3,
            size: 1200,
            rent: 15000,
            type: "apartment",
            floor: 2,
            facilities: ["Parking", "Security", "Elevator"]
        },
        {
            id: "H-103",
            address: "789 Garden Avenue, Islamabad",
            bedrooms: 5,
            size: 2500,
            rent: 35000,
            type: "duplex",
            floor: 1,
            facilities: ["Garden", "Parking", "Security", "Laundry"]
        },
        {
            id: "H-105",
            address: "654 Hill Road, Lahore",
            bedrooms: 3,
            size: 1500,
            rent: 18000,
            type: "house",
            floor: 1,
            facilities: ["Garden", "Parking"]
        }
    ];

    const applicationsList = document.getElementById('eligible-applications');
    const housesList = document.getElementById('available-houses');
    const allocateBtn = document.getElementById('allocate-btn');
    const matchInfo = document.getElementById('match-info');
    
    let selectedApp = null;
    let selectedHouse = null;

    // Function to render applications
    function renderApplications() {
        applicationsList.innerHTML = '';
        
        eligibleApplications.forEach(app => {
            const appDiv = document.createElement('div');
            appDiv.className = 'application-item';
            appDiv.dataset.appId = app.id;
            
            appDiv.innerHTML = `
                <h4>${app.name} <span class="priority-badge priority-${app.priority}">Priority ${app.priority}</span></h4>
                <div class="application-details">
                    <p>Family: ${app.familySize} members | Income: Rs ${app.income.toLocaleString()}</p>
                    <p>Needs: ${app.needs}</p>
                    <p>Applied: ${app.appliedDate}</p>
                </div>
            `;
            
            appDiv.addEventListener('click', () => selectApplication(app));
            applicationsList.appendChild(appDiv);
        });
    }

    // Function to render houses
    function renderHouses() {
        housesList.innerHTML = '';
        
        availableHouses.forEach(house => {
            const houseDiv = document.createElement('div');
            houseDiv.className = 'house-item';
            houseDiv.dataset.houseId = house.id;
            
            houseDiv.innerHTML = `
                <h4>${house.id} - ${house.type.toUpperCase()}</h4>
                <div class="house-details">
                    <p>${house.address}</p>
                    <p>Bedrooms: ${house.bedrooms} | Size: ${house.size.toLocaleString()} sqft</p>
                    <p>Facilities: ${house.facilities.join(', ')}</p>
                </div>
            `;
            
            houseDiv.addEventListener('click', () => selectHouse(house));
            housesList.appendChild(houseDiv);
        });
    }

    // Function to select application
    function selectApplication(application) {
        selectedApp = application;
        
        // Update UI
        document.querySelectorAll('.application-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-app-id="${application.id}"]`).classList.add('selected');
        
        updateMatchInfo();
    }

    // Function to select house
    function selectHouse(house) {
        selectedHouse = house;
        
        // Update UI
        document.querySelectorAll('.house-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-house-id="${house.id}"]`).classList.add('selected');
        
        updateMatchInfo();
    }

    // Function to calculate match score
    function calculateMatchScore(application, house) {
        let score = 50; // Base score
        
        // Bedroom match (40% weight)
        const bedroomDiff = Math.abs(application.familySize / 2 - house.bedrooms);
        const bedroomScore = Math.max(0, 40 - (bedroomDiff * 10));
        score += bedroomScore;
        
        
        // Priority bonus (20% weight)
        const priorityBonus = (4 - application.priority) * 5; // Priority 1 gets 15, 2 gets 10, etc.
        score += priorityBonus;
        
        // Clamp score between 0-100
        return Math.min(100, Math.max(0, Math.round(score)));
    }

    // Function to update match info
    function updateMatchInfo() {
        if (selectedApp && selectedHouse) {
            const matchScore = calculateMatchScore(selectedApp, selectedHouse);
            
            // Get allocation notes
            let notes = [];
            const bedroomDiff = selectedHouse.bedrooms - (selectedApp.familySize / 2);
            
            if (bedroomDiff >= 1) {
                notes.push("Good bedroom match");
            } else if (bedroomDiff >= 0) {
                notes.push("Adequate bedrooms");
            } else {
                notes.push("Might be cramped");
            }
            
            
            // Update display
            document.getElementById('selected-app').textContent = `${selectedApp.name} (${selectedApp.id})`;
            document.getElementById('selected-house').textContent = `${selectedHouse.id} - ${selectedHouse.type}`;
            document.getElementById('match-score').textContent = matchScore;
            document.getElementById('allocation-notes').textContent = notes.join(', ');
            
            // Show match info and enable button
            matchInfo.classList.add('visible');
            allocateBtn.disabled = false;
            
            // Color code based on score
            if (matchScore >= 80) {
                matchInfo.style.backgroundColor = '#e8f5e9';
            } else if (matchScore >= 60) {
                matchInfo.style.backgroundColor = '#fff3e0';
            } else {
                matchInfo.style.backgroundColor = '#ffebee';
                allocateBtn.disabled = true;
            }
        } else {
            matchInfo.classList.remove('visible');
            allocateBtn.disabled = true;
        }
    }

    // Allocation function
    allocateBtn.addEventListener('click', function() {
        if (selectedApp && selectedHouse) {
            const matchScore = calculateMatchScore(selectedApp, selectedHouse);
            
            if (confirm(`Allocate ${selectedHouse.id} to ${selectedApp.name}?\nMatch Score: ${matchScore}/100`)) {
                // In real app, this would send to backend
                alert(`Allocation successful!\n\n` +
                      `${selectedApp.name} has been allocated ${selectedHouse.id}\n` +
                      `Address: ${selectedHouse.address}\n` +
                      `Match Score: ${matchScore}/100`);
                
                // Reset selection
                selectedApp = null;
                selectedHouse = null;
                
                // Update UI
                document.querySelectorAll('.application-item, .house-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                matchInfo.classList.remove('visible');
                allocateBtn.disabled = true;
                
                // Refresh lists (in real app, this would come from updated data)
                setTimeout(() => {
                    alert("Lists have been updated. This house is no longer available.");
                }, 500);
            }
        }
    });

    // Initial render
    renderApplications();
    renderHouses();
});