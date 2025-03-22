const mongoose = require('mongoose');
require('dotenv').config();

// Import the Vehicle model
const Vehicle = require('./models/Vehicle');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Dummy vehicle data
const vehicles = [
  {
    number: "MH12CD5678",
    name: "Honda Civic",
    type: "Car",
    fuelType: "Diesel",
    yearOfManufacture: 2018,
    issuedAt: "Pune RTO",
    issueDate: "2018-06-15",
    validFromDate: "2018-06-15",
    expiryDate: "2028-06-15",
    status: "Active",
    contact: "+919876543211",
    carbonFootprint: {
      distanceTravelled: 150,
      fuelEfficiency: 20,
      carbonEmitted: 8.25,
      status: "✅ Good"
    },
    lastChecked: "2025-03-21T11:00:00Z",
    imageLink: "https://server.com/images/MH12CD5678.jpeg",
    notificationSent: false
  },
  {
    number: "MH12EF9012",
    name: "Ford Mustang",
    type: "Car",
    fuelType: "Petrol",
    yearOfManufacture: 2021,
    issuedAt: "Mumbai RTO",
    issueDate: "2021-04-05",
    validFromDate: "2021-04-05",
    expiryDate: "2031-04-05",
    status: "Active",
    contact: "+919876543212",
    carbonFootprint: {
      distanceTravelled: 80,
      fuelEfficiency: 15,
      carbonEmitted: 15.20,
      status: "❌ Exceeding Limit"
    },
    lastChecked: "2025-03-19T10:45:00Z",
    imageLink: "https://server.com/images/MH12EF9012.jpeg",
    notificationSent: true
  },
  {
    number: "MH12GH3456",
    name: "Suzuki Swift",
    type: "Car",
    fuelType: "Petrol",
    yearOfManufacture: 2017,
    issuedAt: "Delhi RTO",
    issueDate: "2017-07-22",
    validFromDate: "2017-07-22",
    expiryDate: "2027-07-22",
    status: "Inactive",
    contact: "+919876543213",
    carbonFootprint: {
      distanceTravelled: 120,
      fuelEfficiency: 17,
      carbonEmitted: 10.59,
      status: "✅ Good"
    },
    lastChecked: "2025-03-22T09:30:00Z",
    imageLink: "https://server.com/images/MH12GH3456.jpeg",
    notificationSent: false
  },
  {
    number: "MH12IJ7890",
    name: "Hyundai Elantra",
    type: "Car",
    fuelType: "Diesel",
    yearOfManufacture: 2020,
    issuedAt: "Chennai RTO",
    issueDate: "2020-03-10",
    validFromDate: "2020-03-10",
    expiryDate: "2030-03-10",
    status: "Active",
    contact: "+919876543214",
    carbonFootprint: {
      distanceTravelled: 200,
      fuelEfficiency: 20,
      carbonEmitted: 10.00,
      status: "✅ Good"
    },
    lastChecked: "2025-03-20T14:00:00Z",
    imageLink: "https://server.com/images/MH12IJ7890.jpeg",
    notificationSent: false
  },
  {
    number: "MH12KL1234",
    name: "Nissan Altima",
    type: "Car",
    fuelType: "Petrol",
    yearOfManufacture: 2022,
    issuedAt: "Kolkata RTO",
    issueDate: "2022-02-25",
    validFromDate: "2022-02-25",
    expiryDate: "2032-02-25",
    status: "Active",
    contact: "+919876543215",
    carbonFootprint: {
      distanceTravelled: 50,
      fuelEfficiency: 18,
      carbonEmitted: 8.00,
      status: "✅ Good"
    },
    lastChecked: "2025-03-21T12:15:00Z",
    imageLink: "https://server.com/images/MH12KL1234.jpeg",
    notificationSent: false
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First clear the existing data
    await Vehicle.deleteMany({});
    console.log('Cleared existing vehicle data');

    // Insert the new data
    const result = await Vehicle.insertMany(vehicles);
    console.log(`Successfully inserted ${result.length} vehicles`);

    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
