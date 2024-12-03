describe("User Login", () => {
    it("should login user with email and password", () => {
      // Send POST request to registration endpoint
      cy.request({
        url: "http://localhost:8080/api/user/login",
        method: "POST",
        body: { email:'updated.email@gmail.com', 
            password:'UpdatedPassword123$' },
      })
      .its('status')
      .should('equal',200)
    });
  });


  describe("User Registration", () => {
    it("should register a new user", () => {
      // Send POST request to registration endpoint
      cy.request({
        url: "http://localhost:8080/api/user/register",
        method: "POST",
        body: { name: "Test User", email: "testuser0416@gmail.com", password: "Admin1234$"},
      })
      .its('status')
      .should('equal', 200)
    });
  });

//   describe("User Profile", () => {
//     it("should get user profile", () => {
//       // Get request to profile endpoint with valid token
//       cy.request({
//         url: "http://localhost:8080/api/user/profile",
//         method: "GET",
//         headers: { Authorization: "Bearer your_token_here" },
//       })
//       .its('status')
//       .should('equal', 200)
//     });
//   });

//   describe("Verify Email", () => {
//     it("should verify email with valid token", () => {
//       const token = "valid-token-here";  // Use the actual token value for the test
//       cy.request({
//         url: `http://localhost:8080/api/user/verify-email`,
//         method: "POST",
//         body: { token },
//       })
//       .its('status')
//       .should('equal', 200);
//     });
//   });
  

// describe("Verify Email", () => {
//     it("should verify the email address", () => {
      
//       cy.request({
//         url: "http://localhost:8080/api/user/verify-email",
//         method: "POST",
//         body: { email:"ewuser@example.com" },
//       })
//       .its('status')
//       .should('equal', 200); // Ensure the email verification request is successful
//     });
//   });
  
//   describe("Get User Details", () => {
//     it("should retrieve user details", function() {
//       const token = this.authToken;
  
//       cy.request({
//         url: "http://localhost:8080/api/user/user-details",
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .its('status')
//       .should('equal', 200); // Ensure fetching user details was successful
//     });
//   });
  
// describe("Logout Route Test", () => {
//   const loginEndpoint = "http://localhost:8080/api/user/login"; // Replace with your login endpoint
//   const logoutEndpoint = "http://localhost:8080/api/user/logout"; // Replace with your logout endpoint

//   let authToken;

//   before(() => {
//     // Log in to get a valid auth token
//     cy.request({
//       method: "POST",
//       url: loginEndpoint,
//       body: {
//         email: "rukshanfernando0416@gmail.com", // Replace with a valid email
//         password: "Admin1234$", // Replace with a valid password
//       },
//     }).then((response) => {
//       expect(response.status).to.eq(200); // Ensure login is successful
//       authToken = response.body.token; // Assuming the token is returned in the response
//       expect(authToken).to.not.be.null;
//     });
//   });

//   it("should successfully log out the user", () => {
//     // Send a GET request to the logout endpoint with the token
//     cy.request({
//       method: "GET",
//       url: logoutEndpoint,
//       headers: {
//         Authorization: `Bearer ${authToken}`, // Attach the auth token
//       },
//     }).then((response) => {
      
//       expect(response.status).to.eq(200); // Assert successful logout
//       expect(response.body).to.have.property("success", true); // Optional: check success property
//       expect(response.body).to.have.property("message", "Logout successfully"); // Replace with your logout success message
//     });
//   });

// });



// describe("Update User Details Route Test", () => {
//   const loginEndpoint = "http://localhost:8080/api/user/login"; // Replace with your login endpoint
//   const updateUserEndpoint = "http://localhost:8080/api/user/update-user"; // Replace with your update-user endpoint

//   let authToken;

//   before(() => {
//     // Log in to get a valid auth token
//     cy.request({
//       method: "POST",
//       url: loginEndpoint,
//       body: {
//         email: "updated.email@gmail.com", // Replace with a valid email
//         password: "UpdatedPassword123$", // Replace with a valid password
//       },
//     }).then((response) => {
//       expect(response.status).to.eq(200); // Ensure login is successful
//       authToken = response.body.token; // Assuming the token is returned in the response
//       expect(authToken).to.not.be.null;
//     });
//   });

//   it("should successfully update user details", () => {
//     const updatedDetails = {
//       name: "Rukshan Fernando Updated",
//       email: "rukshanfernando0416@gmail.com",
//       mobile: "0771234567",
//       password: "Admin1234$", // Optional: can omit this for partial update
//     };

//     // Send a PUT request to update user details
//     cy.request({
//       method: "PUT",
//       url: updateUserEndpoint,
//       headers: {
//         Authorization: `Bearer ${authToken}`, // Attach the auth token
//       },
//       body: updatedDetails, // Send the updated details
//     }).then((response) => {
//       expect(response.status).to.eq(200); // Assert success status code
//       expect(response.body).to.have.property("success", true); // Assert success property
//       expect(response.body).to.have.property("message", "Updated successfully"); // Assert success message
//       expect(response.body.data).to.exist; // Ensure data is returned
//     });
//   });

//   it("should handle invalid input gracefully", () => {
//     const invalidDetails = {
//       email: "invalid-email", // Invalid email format
//     };

//     cy.request({
//       method: "PUT",
//       url: updateUserEndpoint,
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//       body: invalidDetails,
//       failOnStatusCode: false, // Prevent Cypress from failing on non-2xx responses
//     }).then((response) => {
//       expect(response.status).to.be.oneOf([400, 500]); // Assert client or server error
//       expect(response.body).to.have.property("success", false); // Assert failure
//       expect(response.body).to.have.property("error", true); // Assert error flag
//     });
//   });
// });


