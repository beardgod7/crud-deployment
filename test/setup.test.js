process.env.NODE_ENV = 'test';
const User = require('../database/models/user');

// Clean up the database before each test
beforeEach(async () => {
    await User.deleteMany({});
});

// Clean up the database after each test
afterEach(async () => {
    await User.deleteMany({});
})