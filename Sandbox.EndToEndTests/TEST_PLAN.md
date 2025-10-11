# Sandbox Application - Comprehensive E2E Test Plan

## Application Overview

The Sandbox application is an Angular-based customer management system with a .NET backend using the BFF (Backend for Frontend) pattern with Keycloak authentication. The application features:

- **Authentication**: OpenID Connect flow via Keycloak with session-based authentication (HTTP-only cookies)
- **Customer Management**: CRUD operations for customers with support for billing and shipping addresses
- **API Gateway**: YARP-based gateway handling authentication and request proxying
- **Form Validation**: Client-side validation with Signal Forms and server-side validation
- **Navigation**: Angular routing with authenticated and anonymous states
- **Error Handling**: Graceful error messages and retry mechanisms

### Key Features

1. **Authentication Flow**
   - Login via `/bff/login` redirects to Keycloak
   - Session stored server-side with HTTP-only cookies
   - Logout clears both application and OIDC sessions
   - User information displayed in header

2. **Customer Management**
   - List all customers in a table
   - Create customers with optional billing and shipping addresses
   - View detailed customer information
   - Delete customers (soft delete)
   - Random delay simulation (10-2000ms) on customer creation

3. **Form Validation Rules**
   - First Name: Required
   - Last Name: Required
   - Billing Address: Optional, when enabled all fields required
     - Street: Required, min 3 characters
     - City: Required, min 3 characters
     - Zip Code: Required, 3-5 characters
   - Shipping Address: Optional, when enabled all fields required
     - Street: Required, min 3 characters
     - City: Required, min 3 characters
     - Zip Code: Required, 3-5 characters
     - Note: Optional, but if provided must be min 10 characters

## Test Scenarios

---

### 1. Authentication and User Management

**Seed:** `setup/auth.setup.ts` (existing authentication setup)

#### 1.1 User Login Flow

**Steps:**

1. Navigate to application root `/`
2. Observe anonymous header with "Login" link
3. Click "Login" link
4. On Keycloak page, enter valid username from environment config
5. Enter valid password from environment config
6. Submit the login form

**Expected Results:**

- User is redirected back to application
- Header displays "👋 Hello, {username}"
- Header shows authenticated navigation (Customers, Current User, Logout)
- Session cookie `__Sandbox` is set

#### 1.2 View Current User Information

**Steps:**

1. Ensure user is authenticated
2. Click "Current User" link in navigation

**Expected Results:**

- User page displays user information
- `isAuthenticated` is `true`
- User's name is displayed
- Claims list is visible with user claims

#### 1.3 User Logout Flow

**Steps:**

1. Ensure user is authenticated
2. Click "Logout" link in navigation
3. Wait for redirect

**Expected Results:**

- User is logged out from both application and Keycloak
- Anonymous header is displayed
- Session cookie is cleared
- User is redirected to home page

#### 1.4 Protected Route Access Without Authentication

**Steps:**

1. Clear all cookies and storage
2. Attempt to navigate directly to `/customers`

**Expected Results:**

- User is redirected to login page
- After login, user is redirected back to `/customers`

---

### 2. Customer Creation - Happy Path Scenarios

**Seed:** `setup/auth.setup.ts`

#### 2.1 Create Customer - Minimal Information Only

**Steps:**

1. Navigate to `/customers`
2. Locate "Create Customer" form
3. In "First Name" textbox, type a unique first name (e.g., "John{randomString}")
4. In "Last Name" textbox, type a unique last name (e.g., "Doe{randomString}")
5. Leave both "Add Billing Address" and "Add Shipping Address" checkboxes unchecked
6. Click "Create Customer" button

**Expected Results:**

- Button text changes to "Creating Customer" while submitting
- Button is disabled during submission
- After creation (accounting for random delay), new customer appears in the table
- Customer name is displayed as "{FirstName} {LastName}" in table cell
- "View Details" link is visible for the new customer
- Form is reset and cleared for next entry

#### 2.2 Create Customer - With Billing Address

**Steps:**

1. Navigate to `/customers`
2. In "First Name" textbox, type "Jane{randomString}"
3. In "Last Name" textbox, type "Smith{randomString}"
4. Check "Add Billing Address" checkbox
5. Verify billing address fieldset appears
6. In billing "Street" textbox, type "123 Main Street"
7. In billing "City" textbox, type "Springfield"
8. In billing "Zip Code" textbox, type "12345"
9. Press Enter or click "Create Customer" button

**Expected Results:**

- Customer is created successfully
- Customer appears in the table
- Form is reset including billing address fields
- Billing address checkbox is unchecked after creation

#### 2.3 Create Customer - With Shipping Address (No Note)

**Steps:**

1. Navigate to `/customers`
2. In "First Name" textbox, type "Alice{randomString}"
3. In "Last Name" textbox, type "Johnson{randomString}"
4. Check "Add Shipping Address" checkbox
5. Verify shipping address fieldset appears
6. In shipping "Street" textbox, type "456 Oak Avenue"
7. In shipping "City" textbox, type "Portland"
8. In shipping "Zip Code" textbox, type "97201"
9. Leave "Note" textarea empty
10. Submit the form

**Expected Results:**

- Customer is created successfully
- Customer appears in the table
- Form is reset

#### 2.4 Create Customer - With Shipping Address and Note

**Steps:**

1. Navigate to `/customers`
2. In "First Name" textbox, type "Bob{randomString}"
3. In "Last Name" textbox, type "Williams{randomString}"
4. Check "Add Shipping Address" checkbox
5. In shipping "Street" textbox, type "789 Pine Road"
6. In shipping "City" textbox, type "Austin"
7. In shipping "Zip Code" textbox, type "78701"
8. In "Note" textarea, type "Please deliver after 5 PM on weekdays"
9. Submit the form

**Expected Results:**

- Customer is created successfully
- Customer appears in the table
- Form is reset

#### 2.5 Create Customer - With Both Billing and Shipping Addresses

**Steps:**

1. Navigate to `/customers`
2. In "First Name" textbox, type "Carol{randomString}"
3. In "Last Name" textbox, type "Davis{randomString}"
4. Check "Add Billing Address" checkbox
5. Fill billing address:
   - Street: "100 Commerce Blvd"
   - City: "Seattle"
   - Zip Code: "98101"
6. Check "Add Shipping Address" checkbox
7. Fill shipping address:
   - Street: "200 Residential Lane"
   - City: "Tacoma"
   - Zip Code: "98402"
   - Note: "Leave package at front door if no answer"
8. Submit the form

**Expected Results:**

- Customer is created successfully
- Customer appears in the table with full name
- Form is completely reset with both address sections hidden

---

### 3. Customer Creation - Validation Scenarios

**Seed:** `setup/auth.setup.ts`

#### 3.1 Submit Empty Form

**Steps:**

1. Navigate to `/customers`
2. Without entering any data, click "Create Customer" button

**Expected Results:**

- Form is not submitted
- Validation summary section appears with heading "Validation summary:"
- Validation messages displayed for:
  - First Name (required)
  - Last Name (required)
- Form remains in invalid state
- Button may be disabled or submission prevented

#### 3.2 Validate First Name - Required

**Steps:**

1. Navigate to `/customers`
2. Leave "First Name" field empty
3. In "Last Name" textbox, type "TestLast"
4. Tab out or click away from First Name field
5. Attempt to submit the form

**Expected Results:**

- Form validation catches missing First Name
- Validation summary shows First Name is required
- Form is not submitted

#### 3.3 Validate Last Name - Required

**Steps:**

1. Navigate to `/customers`
2. In "First Name" textbox, type "TestFirst"
3. Leave "Last Name" field empty
4. Attempt to submit the form

**Expected Results:**

- Form validation catches missing Last Name
- Validation summary shows Last Name is required
- Form is not submitted

#### 3.4 Billing Address - Incomplete Information

**Steps:**

1. Navigate to `/customers`
2. In "First Name" textbox, type "Test"
3. In "Last Name" textbox, type "User"
4. Check "Add Billing Address" checkbox
5. In billing "Street" textbox, type only "St" (2 characters)
6. Leave other billing fields empty
7. Attempt to submit the form

**Expected Results:**

- Validation summary appears
- Street shows minimum length error (requires 3 characters)
- City shows required error
- Zip Code shows required error
- Form is not submitted

#### 3.5 Billing Address - Zip Code Length Validation

**Steps:**

1. Navigate to `/customers`
2. In "First Name" textbox, type "Test"
3. In "Last Name" textbox, type "User"
4. Check "Add Billing Address" checkbox
5. In billing "Street" textbox, type "Main Street"
6. In billing "City" textbox, type "Portland"
7. In billing "Zip Code" textbox, type "12" (2 characters)
8. Attempt to submit the form

**Expected Results:**

- Validation summary appears
- Zip Code shows error: "Zip code must be between 3 and 5 characters long."
- Form is not submitted

#### 3.6 Billing Address - Zip Code Maximum Length

**Steps:**

1. Navigate to `/customers`
2. Fill required fields (First Name, Last Name)
3. Check "Add Billing Address" checkbox
4. Fill billing address with valid street and city
5. In billing "Zip Code" textbox, type "123456" (6 characters)
6. Attempt to submit the form

**Expected Results:**

- Validation summary appears
- Zip Code shows error: "Zip code must be between 3 and 5 characters long."
- Form is not submitted

#### 3.7 Shipping Address - Note Minimum Length

**Steps:**

1. Navigate to `/customers`
2. Fill required fields (First Name, Last Name)
3. Check "Add Shipping Address" checkbox
4. Fill shipping address with valid street, city, and zip code
5. In "Note" textarea, type "Short" (5 characters, less than minimum 10)
6. Attempt to submit the form

**Expected Results:**

- Validation summary appears
- Note field shows minimum length error (requires 10 characters)
- Form is not submitted

#### 3.8 Shipping Address - Valid Short Zip Code

**Steps:**

1. Navigate to `/customers`
2. Fill required fields with valid data
3. Check "Add Shipping Address" checkbox
4. Fill shipping address:
   - Street: "Test Street"
   - City: "Test City"
   - Zip Code: "123" (minimum valid length)
5. Submit the form

**Expected Results:**

- Form is submitted successfully
- Customer is created
- Customer appears in the table

#### 3.9 Dynamically Toggle Address Sections

**Steps:**

1. Navigate to `/customers`
2. Check "Add Billing Address" checkbox
3. Verify billing address fields appear
4. Fill billing address with valid data
5. Uncheck "Add Billing Address" checkbox
6. Verify billing address section is hidden
7. Check "Add Billing Address" again
8. Verify billing address fields are empty (form maintains state but validation is hidden)

**Expected Results:**

- Address sections show/hide correctly based on checkbox state
- When section is hidden, validation for those fields is not applied
- Form state is maintained when toggling

---

### 4. Customer Details and Navigation

**Seed:** `setup/auth.setup.ts`

#### 4.1 View Customer Details - Minimal Customer

**Steps:**

1. Navigate to `/customers`
2. Create a customer with only First Name and Last Name (no addresses)
3. Wait for customer to appear in table
4. Click "View Details" link for the newly created customer

**Expected Results:**

- Browser navigates to `/customers/{customerId}` (URL contains customer ID)
- Page displays heading "Customer Details"
- "Back to Overview" link is visible and points to `/customers`
- "Personal Information" fieldset displays:
  - Name: {FirstName} {LastName}
- "Billing Addresses" fieldset is not displayed (no billing addresses)
- "Shipping Addresses" fieldset is not displayed (no shipping addresses)

#### 4.2 View Customer Details - With Billing Address

**Steps:**

1. Navigate to `/customers`
2. Create a customer with First Name, Last Name, and Billing Address
3. Click "View Details" link for the newly created customer

**Expected Results:**

- Customer details page loads
- "Personal Information" section displays name correctly
- "Billing Addresses" fieldset is displayed with:
  - Street: {billing street}
  - City: {billing city}
  - Zip Code: {billing zip code}
- "Shipping Addresses" fieldset is not displayed

#### 4.3 View Customer Details - With Shipping Address and Note

**Steps:**

1. Navigate to `/customers`
2. Create a customer with First Name, Last Name, and Shipping Address with Note
3. Click "View Details" link for the customer

**Expected Results:**

- Customer details page loads
- "Personal Information" section displays correctly
- "Billing Addresses" fieldset is not displayed
- "Shipping Addresses" fieldset is displayed with:
  - Street: {shipping street}
  - City: {shipping city}
  - Zip Code: {shipping zip code}
  - Note: {note text}

#### 4.4 View Customer Details - With Both Address Types

**Steps:**

1. Navigate to `/customers`
2. Create a customer with both Billing and Shipping addresses
3. Click "View Details" link

**Expected Results:**

- Customer details page displays all information
- Both "Billing Addresses" and "Shipping Addresses" fieldsets are visible
- All address data is correctly displayed

#### 4.5 Navigate Back to Overview from Details

**Steps:**

1. Navigate to a customer details page
2. Click "Back to Overview" link

**Expected Results:**

- Browser navigates to `/customers`
- Customer list is visible
- Previously created customer is still in the list

#### 4.6 Direct URL Navigation to Customer Details

**Steps:**

1. Navigate to `/customers` and note a customer ID from the table
2. Manually navigate to `/customers/{noted-customer-id}` in browser address bar

**Expected Results:**

- Customer details page loads correctly
- Customer information is displayed
- No errors occur

#### 4.7 Invalid Customer ID Navigation

**Steps:**

1. Navigate to `/customers/00000000-0000-0000-0000-000000000000` (or another clearly invalid ID)

**Expected Results:**

- Error message is displayed
- Error message shows: "An unexpected error occurred, please try again." (or similar)
- "Retry" button is visible
- User can click retry to attempt reload

---

### 5. Customer List and Table Functionality

**Seed:** `setup/auth.setup.ts`

#### 5.1 View Empty Customer List

**Steps:**

1. Reset database or use fresh environment
2. Navigate to `/customers`

**Expected Results:**

- Page displays "Customers" heading
- Table structure is visible with header "Name"
- Table body shows appropriate message or empty state
- Create Customer form is visible below the table

#### 5.2 View Customer List with Multiple Customers

**Steps:**

1. Navigate to `/customers`
2. Create 3-5 different customers
3. Observe the customer table

**Expected Results:**

- All created customers appear in the table
- Each customer row displays full name
- Each customer row has a "View Details" link
- Customers are listed (order may vary based on backend implementation)

#### 5.3 Create Multiple Customers in Succession

**Steps:**

1. Navigate to `/customers`
2. Create first customer, wait for it to appear
3. Immediately create second customer
4. Create third customer
5. Observe table updates

**Expected Results:**

- Each customer creation completes successfully
- Form resets after each successful creation
- All customers appear in the table
- Table updates reflect new customers as they're created
- No race conditions or duplicate entries

#### 5.4 Verify Table Updates After Customer Creation

**Steps:**

1. Navigate to `/customers`
2. Note the current number of customers in table
3. Create a new customer
4. Verify table automatically updates

**Expected Results:**

- Customer count increases by one
- New customer appears in the table without page refresh
- Customer name is correctly displayed

---

### 6. Error Handling and Edge Cases

**Seed:** `setup/auth.setup.ts`

#### 6.1 Server Error During Customer Creation

**Steps:**

1. Navigate to `/customers`
2. Fill form with valid customer data
3. If possible, simulate server error (e.g., stop backend service temporarily)
4. Submit the form
5. Observe error handling

**Expected Results:**

- Error message is displayed at top of form
- Error message shows: "An unexpected error occurred, please try again."
- Form remains populated with entered data
- User can correct/retry submission

#### 6.2 Network Timeout During Creation

**Steps:**

1. Navigate to `/customers`
2. Fill form with valid data
3. Submit the form
4. Note the random delay (10-2000ms) is built into backend

**Expected Results:**

- "Creating Customer" button text shows during submission
- Button is disabled during creation
- User cannot submit multiple times
- Creation completes after delay
- Customer appears in table after successful creation

#### 6.3 Form Submission with Special Characters

**Steps:**

1. Navigate to `/customers`
2. In "First Name" textbox, type "O'Connor"
3. In "Last Name" textbox, type "José-María"
4. Fill billing address:
   - Street: "123 Main St. #2"
   - City: "São Paulo"
   - Zip Code: "12345"
5. Submit the form

**Expected Results:**

- Customer is created successfully
- Special characters are preserved
- Customer name displays correctly in table
- Customer details show special characters correctly

#### 6.4 Form Submission with Maximum Length Values

**Steps:**

1. Navigate to `/customers`
2. Fill form with long valid values (testing upper boundaries)
3. For Zip Code, use maximum 5 characters: "12345"
4. Submit the form

**Expected Results:**

- Customer is created successfully
- All data is stored and retrieved correctly
- No truncation occurs

#### 6.5 Browser Back Button After Customer Creation

**Steps:**

1. Navigate to `/customers`
2. Create a customer successfully
3. Click "View Details" link
4. On customer details page, click browser back button

**Expected Results:**

- Browser navigates back to `/customers`
- Customer list is displayed
- Newly created customer is still in the list
- Form is in reset state

#### 6.6 Browser Refresh on Customer List Page

**Steps:**

1. Navigate to `/customers`
2. Create one or more customers
3. Press browser refresh (F5 or Ctrl+R)

**Expected Results:**

- Page reloads successfully
- Authentication is maintained (no redirect to login)
- All customers are still displayed
- Form is in initial state

#### 6.7 Browser Refresh on Customer Details Page

**Steps:**

1. Navigate to a customer details page
2. Press browser refresh

**Expected Results:**

- Page reloads successfully
- Customer details are fetched and displayed again
- Authentication is maintained
- No errors occur

#### 6.8 Concurrent Customer Creation (Race Condition)

**Steps:**

1. Navigate to `/customers`
2. Fill customer form with valid data
3. Submit form
4. While first submission is processing (during random delay), do NOT wait
5. Immediately fill form again with different customer data
6. Submit second customer

**Expected Results:**

- First customer submission completes
- Second submission is either queued or fails gracefully
- No form corruption occurs
- Both customers are created successfully (if supported)
- OR second submission shows error/warning about pending operation

---

### 7. Accessibility and Usability

**Seed:** `setup/auth.setup.ts`

#### 7.1 Keyboard Navigation - Form Completion

**Steps:**

1. Navigate to `/customers`
2. Use Tab key to navigate through form fields
3. Fill all required fields using keyboard only
4. Use Tab to reach "Create Customer" button
5. Press Enter to submit

**Expected Results:**

- All form fields are keyboard accessible
- Tab order is logical (First Name → Last Name → checkbox → address fields)
- Form can be completed without mouse
- Form submits successfully with Enter key

#### 7.2 Keyboard Navigation - Checkboxes

**Steps:**

1. Navigate to `/customers`
2. Tab to "Add Billing Address" checkbox
3. Press Space to toggle checkbox
4. Verify billing address fields appear
5. Press Space again to uncheck

**Expected Results:**

- Checkbox responds to Space key
- Fields show/hide correctly
- Focus is maintained appropriately

#### 7.3 Form Labels and Accessibility

**Steps:**

1. Navigate to `/customers`
2. Use screen reader or inspect HTML
3. Verify all form inputs have associated labels

**Expected Results:**

- All inputs have `<label>` elements with `for` attributes
- Labels are descriptive and clear
- Required fields are indicated
- Validation errors are announced by screen readers

#### 7.4 Table Accessibility

**Steps:**

1. Navigate to `/customers` with multiple customers
2. Inspect table structure

**Expected Results:**

- Table uses semantic HTML (`<table>`, `<th>`, `<td>`)
- Column headers are properly marked
- Links in table are keyboard accessible
- Table is navigable with screen reader

---

### 8. Security and Authentication Edge Cases

**Seed:** `setup/auth.setup.ts`

#### 8.1 Session Expiry During Usage

**Steps:**

1. Authenticate successfully
2. Navigate to `/customers`
3. Wait for session to expire (or manually clear session storage)
4. Attempt to create a customer

**Expected Results:**

- API request fails with authentication error
- User is redirected to login page
- After re-authentication, user can return to customer page

#### 8.2 CSRF Token Validation

**Steps:**

1. Authenticate successfully
2. Navigate to `/customers`
3. Open browser DevTools and observe network requests
4. Create a customer
5. Verify `X-XSRF-TOKEN` header is present in POST request

**Expected Results:**

- POST request includes anti-forgery token header
- Request is processed successfully
- CSRF protection is active

#### 8.3 Unauthorized API Access

**Steps:**

1. Logout from application
2. Attempt to directly access API endpoint via browser DevTools or curl
3. Example: POST to `/customers` without authentication

**Expected Results:**

- Request is rejected with 401 Unauthorized
- Error response is returned
- No data modification occurs

---

### 9. Cross-Browser Compatibility

**Seed:** `setup/auth.setup.ts`

#### 9.1 Customer Creation in Firefox

**Steps:**

1. Run test suite in Firefox browser project
2. Navigate to `/customers`
3. Create customer with all fields
4. View customer details

**Expected Results:**

- All functionality works in Firefox
- Form validation behaves correctly
- Customer is created and displayed
- No console errors

#### 9.2 Customer Creation in Chromium

**Steps:**

1. Run test suite in Chromium browser project
2. Navigate to `/customers`
3. Create customer with all fields
4. View customer details

**Expected Results:**

- All functionality works in Chromium
- Form validation behaves correctly
- Customer is created and displayed
- No console errors

---

### 10. Data Persistence and Consistency

**Seed:** `setup/auth.setup.ts`

#### 10.1 Customer Data Persistence

**Steps:**

1. Create a customer with complete information (both addresses)
2. Navigate away from customers page (e.g., to `/user`)
3. Navigate back to `/customers`
4. View the customer details

**Expected Results:**

- Customer still exists in database
- All customer information is intact
- Both addresses are preserved
- Data consistency is maintained

#### 10.2 Multiple Customers with Same Name

**Steps:**

1. Navigate to `/customers`
2. Create customer: "John Doe"
3. Create another customer: "John Doe"
4. Verify both appear in table

**Expected Results:**

- Both customers are created successfully
- Each has unique ID
- Both appear in table (may be indistinguishable by name alone)
- Each can be viewed separately via "View Details"

#### 10.3 Address Data Integrity

**Steps:**

1. Create customer with billing address
2. Note the exact address details
3. View customer details
4. Verify address matches exactly

**Expected Results:**

- Street, City, and Zip Code are stored exactly as entered
- No data truncation or modification
- Special characters preserved
- Case sensitivity maintained

---

## Test Execution Strategy

### Priority Levels

**P0 - Critical (Must Pass)**

- 1.1 User Login Flow
- 2.1 Create Customer - Minimal Information Only
- 2.5 Create Customer - With Both Addresses
- 3.1 Submit Empty Form
- 4.1 View Customer Details - Minimal Customer

**P1 - High Priority**

- 1.3 User Logout Flow
- 2.2 Create Customer - With Billing Address
- 2.3 Create Customer - With Shipping Address
- 3.4 Billing Address - Incomplete Information
- 4.5 Navigate Back to Overview

**P2 - Medium Priority**

- All remaining validation scenarios (3.x series)
- Error handling scenarios (6.x series)
- Accessibility scenarios (7.x series)

**P3 - Low Priority**

- Edge cases and security scenarios
- Cross-browser specific tests
- Data persistence verification

### Test Data Management

- Use random string generation (`generateRandomString()`) for names to avoid conflicts
- Each test should be independent and not rely on data from other tests
- Clean up test data after test runs where possible (delete customers)
- Use meaningful test data that's easy to identify in failures

### Execution Environment

- **Local Development**: Run tests against local Aspire environment
- **CI/CD**: Run tests with `--workers=1` to prevent concurrency issues
- **Retry Strategy**: 2 retries on CI, 0 retries on local
- **Browser Coverage**: Chromium and Firefox (as configured)

### Known Limitations

- Random delay (10-2000ms) on customer creation may cause timing issues
- Session expiry testing may require manual intervention
- Server error simulation requires infrastructure changes
- Concurrent creation tests may be flaky due to timing

## Success Metrics

- **Code Coverage**: All user-facing features covered by at least one test
- **Pass Rate**: 95%+ pass rate in CI environment
- **Execution Time**: Full suite completes in under 10 minutes
- **Reliability**: No more than 1-2% flaky tests
- **Maintainability**: Tests use Page Object Model or similar pattern

## Recommended Test Additions

Based on this plan, consider implementing:

1. **Page Objects**: Create reusable page objects for CustomerList, CustomerForm, CustomerDetails
2. **Custom Fixtures**: Create fixtures for "authenticated user with N customers"
3. **Test Helpers**: Extract common operations (createCustomer, deleteCustomer) into helpers
4. **Visual Regression**: Add screenshot comparison tests for key pages
5. **Performance Tests**: Add tests measuring page load times and API response times
6. **API Tests**: Add direct API testing for edge cases not easily testable via UI

## Next Steps

1. Review and prioritize test scenarios with team
2. Implement P0 critical tests first
3. Set up test infrastructure (Page Objects, fixtures, helpers)
4. Implement P1 and P2 tests incrementally
5. Integrate tests into CI/CD pipeline
6. Monitor test stability and adjust retry/timeout strategies
7. Review and update test plan quarterly
