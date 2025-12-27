// Applications Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sample applications data
    const applications = [
        {
            id: "APP-001",
            name: "Ali Khan",
            age: 45,
            familySize: 6,
            priorityScore: 92,
            status: "approved",
            appliedDate: "2025-03-10",
            contact: "+923001234567"
        },
        {
            id: "APP-002",
            name: "Sara Ahmed",
            age: 38,
            familySize: 4,
            priorityScore: 85,
            status: "pending",
            appliedDate: "2025-03-12",
            contact: "+923001234568"
        },
        {
            id: "APP-003",
            name: "Ahmed Raza",
            age: 50,
            familySize: 5,
            priorityScore: 95,
            status: "allocated",
            appliedDate: "2025-03-05",
            contact: "+923001234569"
        },
        {
            id: "APP-004",
            name: "Fatima Noor",
            age: 42,
            familySize: 3,
            priorityScore: 78,
            status: "reviewed",
            appliedDate: "2025-03-14",
            contact: "+923001234570"
        },
        {
            id: "APP-005",
            name: "Bilal Khan",
            age: 35,
            familySize: 7,
            priorityScore: 98,
            status: "approved",
            appliedDate: "2025-03-13",
            contact: "+923001234571"
        }
    ];

    const applicationsTable = document.getElementById('applications-table');
    const statusFilter = document.getElementById('status-filter');
    const priorityFilter = document.getElementById('priority-filter');
    const familyFilter = document.getElementById('family-filter');

    // Function to get priority class based on score
    function getPriorityClass(score) {
        if (score >= 90) return 'priority-high';
        if (score >= 75) return 'priority-medium';
        return 'priority-low';
    }

    // Function to get priority text
    function getPriorityText(score) {
        if (score >= 90) return 'High';
        if (score >= 75) return 'Medium';
        return 'Low';
    }

    // Function to render applications
    function renderApplications(filteredApps = applications) {
        applicationsTable.innerHTML = '';
        
        if (filteredApps.length === 0) {
            applicationsTable.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        No applications found matching the filters.
                    </td>
                </tr>
            `;
            return;
        }

        filteredApps.forEach(app => {
            const priorityClass = getPriorityClass(app.priorityScore);
            const priorityText = getPriorityText(app.priorityScore);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${app.id}</td>
                <td>${app.name}</td>
                <td>${app.age}</td>
                <td>${app.familySize}</td>
                <td class="${priorityClass}">${app.priorityScore} (${priorityText})</td>
                <td>
                    <span class="house-status status-${app.status}">
                        ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                </td>
                <td>${app.appliedDate}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewApplication('${app.id}')">View</button>
                    <button class="action-btn allocate-btn" onclick="allocateApplication('${app.id}')" ${app.status !== 'approved' ? 'disabled' : ''}>Allocate</button>
                    <button class="action-btn reject-btn" onclick="rejectApplication('${app.id}')" ${app.status === 'rejected' || app.status === 'allocated' ? 'disabled' : ''}>Reject</button>
                </td>
            `;
            applicationsTable.appendChild(row);
        });
    }

    // Function to filter applications
    function filterApplications() {
        const statusValue = statusFilter.value;
        const priorityValue = priorityFilter.value;
        const familyValue = familyFilter.value;

        const filtered = applications.filter(app => {
            // Filter by status
            if (statusValue !== 'all' && app.status !== statusValue) {
                return false;
            }

            // Filter by priority
            if (priorityValue !== 'all') {
                let priority = getPriorityText(app.priorityScore).toLowerCase();
                if (priority !== priorityValue) {
                    return false;
                }
            }

            // Filter by family size
            if (familyValue !== 'all') {
                if (familyValue === '1-3' && (app.familySize < 1 || app.familySize > 3)) {
                    return false;
                }
                if (familyValue === '4-6' && (app.familySize < 4 || app.familySize > 6)) {
                    return false;
                }
                if (familyValue === '7+' && app.familySize < 7) {
                    return false;
                }
            }

            return true;
        });

        renderApplications(filtered);
    }

    // Event listeners for filters
    statusFilter.addEventListener('change', filterApplications);
    priorityFilter.addEventListener('change', filterApplications);
    familyFilter.addEventListener('change', filterApplications);

    // Initial render
    renderApplications();

    // Global functions for action buttons
    window.viewApplication = function(appId) {
        const app = applications.find(a => a.id === appId);
        if (app) {
            alert(`Application Details:\n\n` +
                  `ID: ${app.id}\n` +
                  `Name: ${app.name}\n` +
                  `Age: ${app.age}\n` +
                  `Family Size: ${app.familySize}\n` +
                  `Contact: ${app.contact}\n` +
                  `Status: ${app.status}\n` +
                  `Applied: ${app.appliedDate}`);
        }
    };

    window.allocateApplication = function(appId) {
        if (confirm(`Allocate a house to application ${appId}?`)) {
            alert(`Application ${appId} has been queued for allocation.\nRedirecting to allocation page...`);
            window.location.href = 'admin-allocate.html';
        }
    };

    window.rejectApplication = function(appId) {
        if (confirm(`Reject application ${appId}? This action cannot be undone.`)) {
            alert(`Application ${appId} has been rejected.`);
            // In real app, this would update the database
        }
    };
});