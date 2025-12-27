// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in real app, this would come from API
    const dashboardData = {
        totalApplications: 154,
        pendingApplications: 23,
        availableHouses: 12,
        allocatedToday: 3,
        recentActivities: [
            {
                name: "Ahmed Raza",
                date: "2025-03-15 10:30",
                status: "allocated",
                house: "H-102"
            },
            {
                name: "Sara Ahmed",
                date: "2025-03-15 09:15",
                status: "pending",
                action: "Application reviewed"
            },
            {
                name: "John Smith",
                date: "2025-03-14 16:45",
                status: "allocated",
                house: "H-205"
            }
        ]
    };

    // Update dashboard stats
    document.getElementById('total-applications').textContent = dashboardData.totalApplications;
    document.getElementById('pending-applications').textContent = dashboardData.pendingApplications;
    document.getElementById('available-houses').textContent = dashboardData.availableHouses;
    document.getElementById('allocated-today').textContent = dashboardData.allocatedToday;

    // Populate recent activities
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';
    
    if (dashboardData.recentActivities.length === 0) {
        activityList.innerHTML = '<p class="no-activity">No recent activity</p>';
    } else {
        dashboardData.recentActivities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            const statusClass = activity.status === 'allocated' ? 'status-allocated' : 'status-pending';
            
            activityItem.innerHTML = `
                <div class="activity-details">
                    <div class="activity-name">${activity.name}</div>
                    <div class="activity-date">${activity.date}</div>
                </div>
                <div class="activity-status ${statusClass}">
                    ${activity.status === 'allocated' ? `Allocated ${activity.house}` : 'Pending Review'}
                </div>
            `;
            
            activityList.appendChild(activityItem);
        });
    }
});