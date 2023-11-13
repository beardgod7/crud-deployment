const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
const jwt = require('jsonwebtoken');
const User = require('../database/models/user');
chai.use(chaiHttp);





describe('User Registration and Activation Routes', () => {
   
  it('should create a user and return a success response', (done) => {
    chai
      .request(server)
      .post("/api/v2/user/create-user")
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('success').to.be.true;
        expect(res.body).to.have.property('message').to.include('please check your email');
        done(); // Call done to indicate test completion
      })
  });
  
  it('should for when fields are not found', (done) => {
    chai
      .request(server)
      .post("/api/v2/user/create-user")
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message').to.include('All required fields must be provided');
        done(); // Call done to indicate test completion
      })
  });
  it('should create a new user with a valid activation token', (done) => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword',
    };
    const activationToken = jwt.sign(user, process.env.ACTIVATION_SECRET, {
      expiresIn: '1h', // Set the token expiration time
    });

     chai
      .request(server)
      .post('/api/v2/user/activation')
      .send({ activation_token: activationToken })
      .end(async (err, res) => {
        // Assuming that your sendToken function sets the authorization token in the response

        expect(res).to.have.status(201); // Expect a successful creation response
        expect(res.body).to.have.property('token'); // Adjust this based on your response structure

        // Verify that the user is created in the database
        const createdUser = await User.findOne({ email: user.email });
        expect(createdUser).to.exist;
        expect(createdUser.name).to.equal(user.name);
        expect(createdUser.email).to.equal(user.email);

        done();
      });
  });
})
 

