const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Replace with the correct path to your Express app

chai.use(chaiHttp);
const expect = chai.expect;

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
  
})
