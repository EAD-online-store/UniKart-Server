describe("Forgot Password Route Test", () => {
    const forgotPasswordEndpoint = "http://localhost:8080/api/user/forgot-password"; // Replace with your endpoint
  
    it("should successfully send OTP when a valid email is provided", () => {
      const validEmail = "nimeshaabesinghe.official@gmail.com"; // Replace with a valid email
  
      cy.request({
        method: "PUT",
        url: forgotPasswordEndpoint,
        body: { email: validEmail },
      }).then((response) => {
        expect(response.status).to.eq(200); // Assert success status
        expect(response.body).to.have.property("success", true); // Assert success property
        expect(response.body).to.have.property("message", "check your email"); // Assert success message
      });
    });
  
    it("should fail when an invalid email is provided", () => {
      const invalidEmail = "notexistingemail@example.com"; // Replace with an invalid email
  
      cy.request({
        method: "PUT",
        url: forgotPasswordEndpoint,
        body: { email: invalidEmail },
        failOnStatusCode: false, // Prevent Cypress from failing on non-2xx responses
      }).then((response) => {
        expect(response.status).to.eq(400); // Assert client error
        expect(response.body).to.have.property("success", false); // Assert failure
        expect(response.body).to.have.property("message", "Email not available"); // Assert error message
      });
    });
  
    it("should fail with missing email in the request body", () => {
      cy.request({
        method: "PUT",
        url: forgotPasswordEndpoint,
        body: {}, // No email provided
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400); // Assert client error
        expect(response.body).to.have.property("success", false); // Assert failure
        expect(response.body).to.have.property("message"); // Check for any error message
      });
    });
  });
  