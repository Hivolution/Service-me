// QR code generation and scanning logic will go here

document.addEventListener('DOMContentLoaded', function() {
    // Partner Dashboard Logic
    if (document.getElementById('qrScannerReader')) {
        initPartnerDashboard();
    }

    // User Registration QR Display (already handled in registration-confirmation.html inline script)
    // If we wanted to move that here, it would be:
    // const qrCodeContainer = document.getElementById('qrCodeContainer'); // On registration confirmation
    // if (qrCodeContainer) {
    //     const qrCodeId = localStorage.getItem('pendingQrCodeId');
    //     if (qrCodeId) {
    //         new QRCode(qrCodeContainer, { /* ... options ... */ });
    //         // localStorage.removeItem('pendingQrCodeId'); // Or keep for refresh
    //     }
    // }
});

let html5QrCode = null; // To store the scanner instance
let dailyScansCount = 0; // Simulated daily scans

function initPartnerDashboard() {
    const loggedInPartnerId = localStorage.getItem('loggedInPartnerId');
    if (!loggedInPartnerId) {
        window.location.href = 'partner-login.html';
        return;
    }

    const currentPartner = partners.find(p => p.id === loggedInPartnerId);
    if (currentPartner) {
        const welcomeMsg = document.getElementById('partnerWelcomeMessage');
        if (welcomeMsg) {
            welcomeMsg.textContent = `Welkom, ${currentPartner.name}!`;
        }
    }


    const startScanButton = document.getElementById('startScanButton');
    const stopScanButton = document.getElementById('stopScanButton');
    const scanResultElement = document.getElementById('scanResult');
    const dailyScansElement = document.getElementById('dailyScans');

    html5QrCode = new Html5Qrcode("qrScannerReader");

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        scanResultElement.classList.remove('scan-error', 'scan-success'); // Clear previous styles

        // Assuming decodedText is the user's qrCodeId
        const foundUser = users.find(user => user.qrCodeId === decodedText);

        if (foundUser) {
            scanResultElement.textContent = `Gebruiker geverifieerd: ${foundUser.firstName} ${foundUser.lastName}. Service geregistreerd.`;
            scanResultElement.classList.add('scan-success');

            // Simulate incrementing daily scans
            dailyScansCount++;
            if (dailyScansElement) {
                dailyScansElement.textContent = dailyScansCount;
            }

            // For a real app, you would log this service transaction.
            // e.g., serviceHistory.push({ userId: foundUser.id, partnerId: loggedInPartnerId, service: 'default', date: new Date() });

            // Optional: Stop scanning after a successful scan
            // stopScanning();
        } else {
            scanResultElement.textContent = "QR-code ongeldig of gebruiker niet gevonden.";
            scanResultElement.classList.add('scan-error');
        }
    };

    const qrCodeErrorCallback = (errorMessage) => {
        // This callback is called frequently when no QR code is in view.
        // console.warn(`QR Code no longer in front of camera. Error: ${errorMessage}`);
        // You might want to update the UI to say "Scanning..." or similar if it's not already obvious.
    };

    startScanButton.addEventListener('click', () => {
        scanResultElement.textContent = "QR-scanner starten...";
        scanResultElement.classList.remove('scan-error', 'scan-success');

        // Request camera permissions and start scanning.
        // Using { facingMode: "environment" } to prefer the rear camera.
        html5QrCode.start(
            { facingMode: "environment" }, // Or cameraId directly if you implement camera selection
            {
                fps: 10, // Optional frame rate
                qrbox: { width: 250, height: 250 } // Optional QR box dimensions
            },
            qrCodeSuccessCallback,
            qrCodeErrorCallback
        ).then(() => {
            startScanButton.style.display = 'none';
            stopScanButton.style.display = 'inline-block';
            scanResultElement.textContent = "Scan een QR code...";
        }).catch(err => {
            scanResultElement.textContent = `Fout bij starten scanner: ${err}`;
            scanResultElement.classList.add('scan-error');
            console.error("Error starting QR scanner:", err);
        });
    });

    stopScanButton.addEventListener('click', stopScanning);

    function stopScanning() {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
                startScanButton.style.display = 'inline-block';
                stopScanButton.style.display = 'none';
                scanResultElement.textContent = "Scanner gestopt.";
            }).catch(err => {
                console.error("Error stopping QR scanner:", err);
                scanResultElement.textContent = "Fout bij stoppen scanner.";
            });
        }
    }

    // Logout functionality for partner
    const partnerLogoutButton = document.getElementById('partnerLogoutButton');
    if (partnerLogoutButton) {
        partnerLogoutButton.addEventListener('click', function() {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().finally(() => { // Ensure logout even if stop fails
                    localStorage.removeItem('loggedInPartnerId');
                    window.location.href = 'partner-login.html';
                });
            } else {
                localStorage.removeItem('loggedInPartnerId');
                window.location.href = 'partner-login.html';
            }
        });
    }
}
