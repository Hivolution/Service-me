// General application flow and UI updates will go here
document.addEventListener('DOMContentLoaded', function() {
    // User Dashboard Logic
    if (document.getElementById('welcomeMessage')) { // ID from user dashboard
        populateDashboard();
    }

    // Admin Dashboard Logic
    if (document.getElementById('adminUserList')) { // ID from admin dashboard
        initAdminDashboard();
    }

    // User Dashboard Logout Button
    const logoutButton = document.getElementById('logoutButton'); // User dashboard
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedInUserId');
            window.location.href = 'login.html';
        });
    }

    // Note: Partner dashboard logout is in qr.js
    // Note: Admin dashboard might need its own logout if sessions are implemented for admin
});

// --- USER DASHBOARD FUNCTIONS ---
function populateDashboard() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');

    if (!loggedInUserId) {
        window.location.href = 'login.html';
        return; // Stop further execution
    }

    // Find the user in the users array (from script.js)
    // Ensure users array is loaded and accessible here. It should be, as script.js is loaded before app.js
    const currentUser = users.find(user => user.id === loggedInUserId);

    if (!currentUser) {
        console.error('Logged in user ID found, but user data not found in users array. Clearing login.');
        localStorage.removeItem('loggedInUserId');
        window.location.href = 'login.html';
        return; // Stop further execution
    }

    // 1. Populate Welcome Message
    const welcomeMessageElement = document.getElementById('welcomeMessage');
    if (welcomeMessageElement) {
        welcomeMessageElement.textContent = `Welkom terug, ${currentUser.firstName}!`;
    }

    // 2. Display QR Code
    const qrCodeContainer = document.getElementById('userQrCodeContainer');
    if (qrCodeContainer && currentUser.qrCodeId) {
        new QRCode(qrCodeContainer, {
            text: currentUser.qrCodeId,
            width: 180,
            height: 180,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } else if (qrCodeContainer) {
        qrCodeContainer.innerHTML = "<p>QR Code niet beschikbaar.</p>";
    }

    // 3. Populate Service History (Dummy Data)
    const serviceHistoryListElement = document.getElementById('serviceHistoryList');
    if (serviceHistoryListElement) {
        // Clear any existing dummy items if the page were to be re-populated without a reload
        serviceHistoryListElement.innerHTML = '';

        const dummyServiceHistory = [
            { serviceName: "Premium Carwash", date: "2023-10-26", partnerName: "WashWorld" },
            { serviceName: "Basic Clean", date: "2023-10-15", partnerName: "SpeedyWash" },
            { serviceName: "Interieur Detailing", date: "2023-09-30", partnerName: "SparkleClean Autos" }
        ];

        if (dummyServiceHistory.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = "Nog geen services gebruikt.";
            serviceHistoryListElement.appendChild(listItem);
        } else {
            dummyServiceHistory.forEach(service => {
                const listItem = document.createElement('li');
                listItem.textContent = `${service.serviceName} bij ${service.partnerName} op ${service.date}`;
                serviceHistoryListElement.appendChild(listItem);
            });
        }
    }

    // 4. Display Remaining Credits (Simulated)
    const creditsAmountElement = document.getElementById('creditsAmount');
    if (creditsAmountElement) {
        // For now, it's hardcoded in HTML. If we want to set it dynamically:
        // creditsAmountElement.textContent = "100 Credits";
        // Or if user object had credits:
        // creditsAmountElement.textContent = `${currentUser.credits || 0} Credits`;
    }

// --- ADMIN DASHBOARD FUNCTIONS ---
function initAdminDashboard() {
    renderUserList();
    renderPartnerList();
    updateAdminStats();
    setupAddPartnerForm();
    setupExportUsersButton();
}

function renderUserList() {
    const userListDiv = document.getElementById('adminUserList');
    if (!userListDiv) return;

    let tableHTML = '<table><thead><tr><th>Naam</th><th>Email</th><th>QR ID</th><th>Postcode</th></tr></thead><tbody>';
    users.forEach(user => {
        tableHTML += `<tr>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.qrCodeId}</td>
            <td>${user.postcode}</td>
        </tr>`;
    });
    tableHTML += '</tbody></table>';
    userListDiv.innerHTML = tableHTML;
}

function renderPartnerList() {
    const partnerListDiv = document.getElementById('adminPartnerList');
    if (!partnerListDiv) return;

    let tableHTML = '<table><thead><tr><th>Naam</th><th>Email</th><th>Locatie</th><th>Scans (Sim.)</th></tr></thead><tbody>';
    partners.forEach(partner => {
        tableHTML += `<tr>
            <td>${partner.name}</td>
            <td>${partner.email}</td>
            <td>${partner.address || 'N/A'}</td>
            <td>${Math.floor(Math.random() * 100)}</td>
        </tr>`;
    });
    tableHTML += '</tbody></table>';
    partnerListDiv.innerHTML = tableHTML;
}

function updateAdminStats() {
    const totalServicesEl = document.getElementById('adminTotalServices');
    if (totalServicesEl) {
        // Simulate based on serviceHistory or just a random number for now
        const simulatedServices = serviceHistory.length > 0 ? serviceHistory.length : Math.floor(Math.random() * 200) + 50;
        totalServicesEl.textContent = `Totaal uitgevoerde diensten: ${simulatedServices} (gesimuleerd)`;
    }
}

function setupAddPartnerForm() {
    const addPartnerForm = document.getElementById('addPartnerForm');
    if (!addPartnerForm) return;

    addPartnerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('newPartnerName').value.trim();
        const email = document.getElementById('newPartnerEmail').value.trim();
        const location = document.getElementById('newPartnerLocation').value.trim();

        if (!name || !email || !location) {
            alert('Alle velden zijn verplicht voor het toevoegen van een partner.');
            return;
        }

        // Simple ID generation for mock data
        const newPartnerId = 'partner' + Date.now();
        const newPartner = {
            id: newPartnerId,
            name: name,
            email: email,
            password: 'defaultPassword', // Default password for admin-added partners
            address: location,
            services: [] // Initialize with no services
        };

        partners.push(newPartner);
        alert('Partner succesvol toegevoegd!');
        addPartnerForm.reset();
        renderPartnerList(); // Re-render the partner list to show the new addition
        updateAdminStats(); // If adding a partner could affect stats
    });
}

function setupExportUsersButton() {
    const exportButton = document.getElementById('exportUsersButton');
    if (!exportButton) return;

    exportButton.addEventListener('click', function() {
        let csvContent = "Voornaam,Achternaam,Email,QR ID,Postcode\n";
        users.forEach(user => {
            const row = [
                user.firstName,
                user.lastName,
                user.email,
                user.qrCodeId,
                user.postcode
            ].join(",");
            csvContent += row + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "me_time_users.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("CSV Export wordt niet ondersteund in uw browser.");
        }
    });
}

// Helper function for UUID generation if needed in admin features (e.g. new partner ID)
// Already present in auth.js, but if auth.js is not loaded on admin page, might be needed.
// For now, partner ID is simpler.
/*
function generateUUID() {
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
*/
}
