import "cypress-mailisk";

// let validUserId;

// before(() => {
//   cy.request({
//     method: "POST",
//     url: "http://localhost:8080/api/user/register", // Replace with your signup endpoint
//     body: {
//       name: "Test User",
//       email: "testuser@example.com",
//       password: "testpassword",
//     },
//   }).then((response) => {
//     validUserId = response.body._id; // Assuming your API returns the new user ID
//   });
// });

// describe("Verify Email API", () => {
//     let validUserId;

//     // Fetch the valid user ID before running tests
//     before(() => {
//         cy.exec("node seed.js", { failOnNonZeroExit: false }).then((result) => {
//             const output = result.stdout;
//             const match = output.match(/Test user ID:\s*(\w+)/); // Extract the user ID from the seed script's output
//         if (match) {
//           validUserId = match[1];
//         } else {
//           throw new Error("Failed to retrieve valid user ID from seed script.");
//         }
//       });
//     });

//     it("should successfully verify the email address", () => {
//       cy.request({
//         method: "POST",
//         url: "http://localhost:8080/api/user/verify-email",
//         body: { code: validUserId }, // Use the retrieved valid user ID
//       }).then((response) => {
//         expect(response.status).to.eq(200); // Assert that the response status is 200
//         expect(response.body).to.have.property("success", true); // Assert success is true
//         expect(response.body).to.have.property("message", "Verify email done"); // Assert success message
//       });
//     });
//   });

// it("Should verify email", () => {
//     cy.visit("http://localhost:8080/api/user/verify-email");

//     let code;
//     // mailiskSearchInbox will automatically keep retrying until an email matching the prefix arrives
//     // by default it also has a from_timestamp that prevents older emails from being returned by accident
//     // find out more here: https://docs.mailisk.com/guides/cypress.html#usage
//     cy.mailiskSearchInbox(Cypress.env("MAILISK_NAMESPACE"), {
//       to_addr_prefix: testEmailAddress,
//       subject_includes: "verify",
//     }).then((response) => {
//       const emails = response.data;
//       const email = emails[0];
//       // we know that the code is the only number in the email, so we easily filter it out
//       code = email.text.match(/\d+/)[0];
//       expect(code).to.not.be.undefined;

//       // now we enter the code and confirm our email
//       cy.get("#email").type(testEmailAddress);
//       cy.get("#code").type(code);
//       cy.get("form").submit();

//       // we should be redirected to the dashboard as proof of a successful verification
//       cy.location("pathname").should("eq", "/dashboard");
//     });
//   });

describe("Test email verification", () => {
  const testEmailAddress = `test.${new Date().getTime()}@${Cypress.env(
    "MAILISK_NAMESPACE"
  )}.mailisk.net`;

  it("should register a new user", () => {
    // Send POST request to registration endpoint
    cy.request({
      url: "http://localhost:8080/api/user/register",
      method: "POST",
      body: {
        name: "Test User",
        email: "anything@0l4n1hnojfpw.mailisk.net",
        password: "Admin1234$",
      },
    })
      .its("status")
      .should("equal", 200);
  });

  it("Should verify email", () => {
   // cy.visit("https://mailisk.com/dashboard/mailbox/0l4n1hnojfpw");

    // TODO: we need to fill this out
    let code;
    const maxRetries = 10; // You can adjust this value based on how long you want to retry
  const timeout = 5000;
    // mailiskSearchInbox will automatically keep retrying until an email matching the prefix arrives
    // by default it also has a from_timestamp that prevents older emails from being returned by accident
    // find out more here: https://docs.mailisk.com/guides/cypress.html#usage
    cy.mailiskSearchInbox(Cypress.env("MAILISK_NAMESPACE"), {
      to_addr_prefix: testEmailAddress,
      subject_includes: "verify",
      retries: maxRetries, // Limit retry attempts
    timeout: timeout,
    }).then((response) => {
      cy.log(JSON.stringify(response)); 
      const emails = response.data;
      const email = emails[0];
      // we know that the code is the only number in the email, so we easily filter it out
      code = email.text.match(/\d+/)[0];
      expect(code).to.not.be.undefined;

      // now we enter the code and confirm our email
      cy.get("#email").type(testEmailAddress);
      cy.get("#code").type(code);
      cy.get("form").submit();

      // we should be redirected to the dashboard as proof of a successful verification
      cy.location("pathname").should("eq", "http://localhost:8080");
    });
  });
});
