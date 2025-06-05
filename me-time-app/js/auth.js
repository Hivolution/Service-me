// User registration and login logic will go here

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');
    const partnerLoginForm = document.getElementById('partnerLoginForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const postcode = document.getElementById('postcode').value;

            if (!firstName || !lastName || !email || !password || !postcode) {
                alert('Alle velden zijn verplicht.');
                return;
            }

            const userId = generateUUID();
            const qrCodeId = generateUUID(); // Separate UUID for QR code data

            const newUser = {
                id: userId,
                firstName,
                lastName,
                email,
                password, // Reminder: In a real app, hash passwords!
                postcode,
                qrCodeId
            };

            users.push(newUser); // users array is from script.js
            // console.log('User registered:', newUser); // Removed for review
            // console.log('All users:', users); // Removed for review


            localStorage.setItem('pendingQrCodeId', qrCodeId);

            window.location.href = 'registration-confirmation.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessageElement = document.getElementById('loginErrorMessage');

            // Find user in the users array (from script.js)
            const foundUser = users.find(user => user.email === email && user.password === password);

            if (foundUser) {
                localStorage.setItem('loggedInUserId', foundUser.id);
                // loggedInUser = foundUser; // Also update the global variable if needed elsewhere immediately
                if (errorMessageElement) errorMessageElement.textContent = '';
                window.location.href = 'dashboard.html';
            } else {
                if (errorMessageElement) errorMessageElement.textContent = 'Ongeldige e-mail of wachtwoord.';
                localStorage.removeItem('loggedInUserId');
                // loggedInUser = null;
            }
        });
    }

    if (partnerLoginForm) {
        partnerLoginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('partnerEmail').value;
            const password = document.getElementById('partnerPassword').value;
            const errorMessageElement = document.getElementById('partnerLoginErrorMessage');

            // Find partner in the partners array (from script.js)
            const foundPartner = partners.find(partner => partner.email === email && partner.password === password);

            if (foundPartner) {
                localStorage.setItem('loggedInPartnerId', foundPartner.id);
                // loggedInPartner = foundPartner; // Also update the global variable if needed
                if (errorMessageElement) errorMessageElement.textContent = '';
                window.location.href = 'partner-dashboard.html';
            } else {
                if (errorMessageElement) errorMessageElement.textContent = 'Ongeldige e-mail of wachtwoord.';
                localStorage.removeItem('loggedInPartnerId');
                // loggedInPartner = null;
            }
        });
    }
});
