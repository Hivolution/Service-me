let users = [];
let partners = [
    { id: 'partner1', name: 'WashWorld Central', email: 'partner@washworld.com', password: 'password123', address: 'Main Street 123', services: ['Premium Carwash', 'Interior Cleaning'] },
    { id: 'partner2', name: 'SpeedyWash Downtown', email: 'partner@speedywash.com', password: 'securepassword', address: 'Second Ave 45', services: ['Basic Clean', 'Express Wash'] },
    { id: 'partner3', name: 'SparkleClean Autos', email: 'contact@sparkle.com', password: 'sparkle', address: 'Industrial Park 7', services: ['Interieur Detailing', 'Full Package Clean'] }
];
let serviceHistory = []; // To be used later for tracking service usage

let loggedInUser = null;
let loggedInPartner = null;
