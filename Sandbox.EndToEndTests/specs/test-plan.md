# Sandbox Application - Comprehensive Test Plan

## Application Overview

The Sandbox application is a customer management system built with Angular 20 and .NET 10, featuring:

- **Authentication**: Keycloak-based OIDC authentication with BFF (Backend for Frontend) pattern
- **Customer Management**: Full CRUD operations for customer records with address management
- **Address Management**: Support for both billing and shipping addresses (optional)
- **Data Display**: Paginated customer list with refresh functionality
- **User Profile**: Display of authenticated user information and claims
- **API Gateway**: YARP-based gateway handling authentication and routing
- **Observability**: OpenTelemetry integration for monitoring and tracing

### Technology Stack

- Frontend: Angular 20 with Signal Forms and Vitest
- Backend: .NET 10 with Minimal APIs and EF Core
- Authentication: Keycloak (OIDC)
- Database: PostgreSQL
- Gateway: YARP (Yet Another Reverse Proxy)
- Testing: Playwright for E2E tests

---

## Test Scenarios

### 1. Authentication and Authorization

#### 1.1 Successful User Login

**Priority**: Critical  
**Test Type**: Happy Path

**Steps:**

1. Navigate to http://localhost:5165
2. Click the "Login" link in the navigation bar
3. On Keycloak login page, enter username "testuser" in the "Username or email" field
4. Enter password "password123" in the "Password" field
5. Click the "Sign In" button

**Expected Results:**

- User is redirected back to the application home page
- Navigation bar displays "👋 Hello, testuser" greeting
- "Login" link is replaced with "Logout" link
- "Customers" and "Current User" links are accessible
- Session cookie is set (\_\_Sandbox)

---

#### 1.2 Failed Login with Invalid Credentials

**Priority**: High  
**Test Type**: Negative Testing

**Steps:**

1. Navigate to http://localhost:5165
2. Click the "Login" link
3. Enter username "invaliduser" in the "Username or email" field
4. Enter password "wrongpassword" in the "Password" field
5. Click the "Sign In" button

**Expected Results:**

- User remains on Keycloak login page
- Error message is displayed indicating invalid credentials
- User is not authenticated
- No session cookie is set

---

#### 1.3 User Logout

**Priority**: Critical  
**Test Type**: Happy Path

**Preconditions:**

- User is already logged in

**Steps:**

1. Navigate to http://localhost:5165/customers (or any authenticated page)
2. Click the "Logout" link in the navigation bar

**Expected Results:**

- User is logged out from Keycloak
- User is redirected to the application home page
- Navigation bar shows "Login" link instead of "Logout"
- Session cookie is cleared
- Subsequent attempts to access authenticated pages redirect to login

---

#### 1.4 Protected Page Access Without Authentication

**Priority**: High  
**Test Type**: Security Testing

**Preconditions:**

- User is not logged in

**Steps:**

1. Navigate directly to http://localhost:5165/customers (without logging in)

**Expected Results:**

- User is redirected to Keycloak login page
- URL contains redirect parameters to return to /customers after login
- No customer data is displayed before authentication

---

#### 1.5 Session Persistence Across Page Refreshes

**Priority**: Medium  
**Test Type**: Functional Testing

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Verify page loads successfully
3. Refresh the browser page (F5 or browser refresh button)

**Expected Results:**

- User remains authenticated after refresh
- Page loads successfully without redirect to login
- Session cookie persists
- User greeting still displays in navigation bar

---

#### 1.6 View Current User Information

**Priority**: Medium  
**Test Type**: Happy Path

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165
2. Click the "Current User" link in the navigation bar

**Expected Results:**

- User profile page displays JSON response with user information
- `isAuthenticated` field shows `true`
- `name` field shows "testuser"
- `claims` array contains:
  - `jti` (JWT ID)
  - `sub` (Subject/User ID)
  - `typ` (Token type)
  - `sid` (Session ID)
  - `name` (Username)
- All claim values are present and properly formatted

---

### 2. Customer Management - Create Operations

#### 2.1 Create Customer with Only Required Fields

**Priority**: Critical  
**Test Type**: Happy Path

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Scroll to the "Create Customer" form section
3. Enter "John" in the "First Name" field
4. Enter "Doe" in the "Last Name" field
5. Ensure "Add Billing Address" checkbox is unchecked
6. Ensure "Add Shipping Address" checkbox is unchecked
7. Click the "Create Customer" button

**Expected Results:**

- Customer is created successfully
- Form is cleared and reset to initial state
- Customer list refreshes automatically
- New customer "John Doe" appears in the customers table
- Customer has a valid "View Details" link
- No error messages are displayed

---

#### 2.2 Create Customer with Billing Address

**Priority**: Critical  
**Test Type**: Happy Path

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. In the "Create Customer" form:
   - Enter "Jane" in the "First Name" field
   - Enter "Smith" in the "Last Name" field
3. Check the "Add Billing Address" checkbox
4. Verify "Billing Address" section becomes visible
5. In the "Billing Address" section:
   - Enter "123 Main Street" in the "Street" field
   - Enter "Springfield" in the "City" field
   - Enter "12345" in the "Zip Code" field
6. Click the "Create Customer" button

**Expected Results:**

- Customer is created successfully with billing address
- Form is cleared after submission
- Customer "Jane Smith" appears in the customers table
- Clicking "View Details" shows customer with billing address information
- Billing address displays: Street: 123 Main Street, City: Springfield, Zip Code: 12345

---

#### 2.3 Create Customer with Shipping Address

**Priority**: High  
**Test Type**: Happy Path

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. In the "Create Customer" form:
   - Enter "Robert" in the "First Name" field
   - Enter "Brown" in the "Last Name" field
3. Check the "Add Shipping Address" checkbox
4. Verify "Shipping Address" section becomes visible
5. In the "Shipping Address" section:
   - Enter "456 Oak Avenue" in the "Street" field
   - Enter "Riverside" in the "City" field
   - Enter "54321" in the "Zip Code" field
   - Enter "Leave at front door" in the "Note" field (optional)
6. Click the "Create Customer" button

**Expected Results:**

- Customer is created successfully with shipping address
- Form is cleared after submission
- Customer "Robert Brown" appears in the customers table
- Customer details page shows shipping address with all entered information
- Note field displays: "Leave at front door"

---

#### 2.4 Create Customer with Both Billing and Shipping Addresses

**Priority**: High  
**Test Type**: Happy Path

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. In the "Create Customer" form:
   - Enter "Emily" in the "First Name" field
   - Enter "Johnson" in the "Last Name" field
3. Check the "Add Billing Address" checkbox
4. In the "Billing Address" section:
   - Enter "789 Elm Street" in the "Street" field
   - Enter "Portland" in the "City" field
   - Enter "97201" in the "Zip Code" field
5. Check the "Add Shipping Address" checkbox
6. In the "Shipping Address" section:
   - Enter "321 Pine Road" in the "Street" field
   - Enter "Seattle" in the "City" field
   - Enter "98101" in the "Zip Code" field
   - Enter "Delivery between 9-5 PM only" in the "Note" field
7. Click the "Create Customer" button

**Expected Results:**

- Customer is created successfully with both addresses
- Form is cleared after submission
- Customer "Emily Johnson" appears in the customers table
- Customer details page shows both billing and shipping addresses
- All address fields are correctly saved and displayed
- Shipping note is visible and correct

---

#### 2.5 Form Validation - Missing Required Fields

**Priority**: Critical  
**Test Type**: Validation Testing

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Check the "Add Billing Address" checkbox
3. Check the "Add Shipping Address" checkbox
4. Leave all form fields empty
5. Observe the form state (validation errors may appear automatically)

**Expected Results:**

- "Validation summary:" heading is displayed
- Validation errors list includes:
  - "ng.form0.firstName: Field is required"
  - "ng.form0.lastName: Field is required"
  - "ng.form0.billingAddress.street: Field is required"
  - "ng.form0.billingAddress.city: Field is required"
  - "ng.form0.billingAddress.zipCode: Field is required"
  - "ng.form0.shippingAddress.street: Field is required"
  - "ng.form0.shippingAddress.city: Field is required"
  - "ng.form0.shippingAddress.zipCode: Field is required"
- Form does not submit (if Submit button is clicked)
- No customer is created

---

#### 2.6 Form Validation - Minimum Length Requirements

**Priority**: High  
**Test Type**: Boundary Testing

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. In the "Create Customer" form:
   - Enter "A" (1 character) in the "First Name" field
   - Enter "B" (1 character) in the "Last Name" field
3. Check the "Add Billing Address" checkbox
4. In the "Billing Address" section:
   - Enter "St" (2 characters) in the "Street" field
   - Enter "NY" (2 characters) in the "City" field
   - Enter "12" (2 characters) in the "Zip Code" field
5. Attempt to create the customer

**Expected Results:**

- Validation errors indicate minimum length requirements:
  - Street must be at least 3 characters
  - City must be at least 3 characters
  - Zip Code must be between 3 and 5 characters (custom message displayed)
- Form does not submit
- No customer is created

---

#### 2.7 Form Validation - Maximum Length for Zip Code

**Priority**: High  
**Test Type**: Boundary Testing

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. In the "Create Customer" form:
   - Enter "Michael" in the "First Name" field
   - Enter "Williams" in the "Last Name" field
3. Check the "Add Billing Address" checkbox
4. In the "Billing Address" section:
   - Enter "100 Test Street" in the "Street" field
   - Enter "Test City" in the "City" field
   - Enter "123456" (6 characters) in the "Zip Code" field
5. Attempt to create the customer

**Expected Results:**

- Validation error displays: "Zip code must be between 3 and 5 characters long."
- Form does not submit
- No customer is created

---

#### 2.8 Form Validation - Valid Zip Code Range

**Priority**: Medium  
**Test Type**: Boundary Testing

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Test with zip code "123" (minimum valid length):
   - Enter "Test" in First Name
   - Enter "User" in Last Name
   - Check "Add Billing Address"
   - Enter valid street and city (at least 3 characters each)
   - Enter "123" in Zip Code
   - Click "Create Customer"
3. Verify customer is created
4. Repeat test with zip code "12345" (maximum valid length)

**Expected Results:**

- Both "123" and "12345" are accepted as valid zip codes
- No validation errors for zip code field
- Customers are created successfully in both cases

---

#### 2.9 Form Validation - Shipping Note Minimum Length

**Priority**: Medium  
**Test Type**: Validation Testing

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. In the "Create Customer" form:
   - Enter "Sarah" in the "First Name" field
   - Enter "Davis" in the "Last Name" field
3. Check the "Add Shipping Address" checkbox
4. In the "Shipping Address" section:
   - Enter "200 Test Road" in the "Street" field
   - Enter "Test Town" in the "City" field
   - Enter "98765" in the "Zip Code" field
   - Enter "Short" (5 characters) in the "Note" field
5. Attempt to create the customer

**Expected Results:**

- Validation error indicates Note must be at least 10 characters if provided
- Form does not submit
- No customer is created
- Note: Empty note should be valid (note is optional)

---

#### 2.10 Dynamic Form Behavior - Toggle Billing Address

**Priority**: Medium  
**Test Type**: UI/UX Testing

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Observe the form in initial state (billing address section hidden)
3. Check the "Add Billing Address" checkbox
4. Observe the "Billing Address" section appears
5. Enter some data in billing address fields
6. Uncheck the "Add Billing Address" checkbox
7. Observe the "Billing Address" section is hidden
8. Check the "Add Billing Address" checkbox again

**Expected Results:**

- Billing address section is initially hidden
- Checking checkbox reveals billing address fields
- Fields include: Street, City, Zip Code
- Unchecking checkbox hides the section
- Previously entered data may be cleared or preserved (verify behavior)
- Section re-appears when checkbox is checked again

---

#### 2.11 Dynamic Form Behavior - Toggle Shipping Address

**Priority**: Medium  
**Test Type**: UI/UX Testing

**Preconditions:**

- User is logged in
- User is on /customers page

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Observe the form in initial state (shipping address section hidden)
3. Check the "Add Shipping Address" checkbox
4. Observe the "Shipping Address" section appears
5. Enter some data in shipping address fields including note
6. Uncheck the "Add Shipping Address" checkbox
7. Observe the "Shipping Address" section is hidden
8. Check the "Add Shipping Address" checkbox again

**Expected Results:**

- Shipping address section is initially hidden
- Checking checkbox reveals shipping address fields
- Fields include: Street, City, Zip Code, Note
- Note field is optional
- Unchecking checkbox hides the section
- Previously entered data may be cleared or preserved (verify behavior)
- Section re-appears when checkbox is checked again

---

### 3. Customer Management - Read Operations

#### 3.1 View Customer List

**Priority**: Critical  
**Test Type**: Happy Path

**Preconditions:**

- User is logged in
- At least one customer exists in the system

**Steps:**

1. Navigate to http://localhost:5165/customers

**Expected Results:**

- Page title is "Customers"
- "Customers" heading (h2) is displayed
- Customer table is visible with columns:
  - Refresh icon column (🔃 button)
  - Name column
  - Actions column (View Details link)
- All existing customers are listed in the table
- Each customer row displays full name (First Name + Last Name)
- Each customer row has a "View Details" link
- Table is sortable (refresh button present)

---

#### 3.2 Refresh Customer List

**Priority**: High  
**Test Type**: Functional Testing

**Preconditions:**

- User is logged in
- User is on /customers page
- Multiple customers exist

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Note the current list of customers
3. Click the refresh button (🔃) in the table header

**Expected Results:**

- Table refreshes and reloads customer data
- Loading state may be briefly visible (if implemented)
- All customers are still displayed
- Data is consistent with backend
- No error messages appear
- Page doesn't navigate away

---

#### 3.3 View Customer Details - Customer Without Addresses

**Priority**: High  
**Test Type**: Happy Path

**Preconditions:**

- User is logged in
- A customer exists with no billing or shipping address

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Locate a customer without addresses (e.g., created in test 2.1)
3. Click the "View Details" link for that customer

**Expected Results:**

- Navigate to customer details page (URL: /customers/{customerId})
- Page title is "Customers"
- "Customer Details" heading (h2) is displayed
- "Back to Overview" link is visible
- "Personal Information" group displays:
  - Name: {First Name} {Last Name}
- No billing address section is displayed
- No shipping address section is displayed

---

#### 3.4 View Customer Details - Customer With Billing Address Only

**Priority**: High  
**Test Type**: Happy Path

**Preconditions:**

- User is logged in
- A customer exists with billing address but no shipping address

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Locate a customer with billing address only (e.g., created in test 2.2)
3. Click the "View Details" link for that customer

**Expected Results:**

- Navigate to customer details page
- "Personal Information" section displays customer name
- "Billing Addresses" group is visible and contains:
  - Street: {entered street}
  - City: {entered city}
  - Zip Code: {entered zip code}
- No shipping address section is displayed
- All billing address data matches what was entered during creation

---

#### 3.5 View Customer Details - Customer With Shipping Address Only

**Priority**: High  
**Test Type**: Happy Path

**Preconditions:**

- User is logged in
- A customer exists with shipping address but no billing address

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Locate a customer with shipping address only (e.g., created in test 2.3)
3. Click the "View Details" link for that customer

**Expected Results:**

- Navigate to customer details page
- "Personal Information" section displays customer name
- "Shipping Addresses" group is visible and contains:
  - Street: {entered street}
  - City: {entered city}
  - Zip Code: {entered zip code}
  - Note: {entered note} (if provided)
- No billing address section is displayed
- All shipping address data matches what was entered during creation

---

#### 3.6 View Customer Details - Customer With Both Addresses

**Priority**: High  
**Test Type**: Happy Path

**Preconditions:**

- User is logged in
- A customer exists with both billing and shipping addresses

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Locate a customer with both addresses (e.g., created in test 2.4)
3. Click the "View Details" link for that customer

**Expected Results:**

- Navigate to customer details page
- "Personal Information" section displays customer name
- "Billing Addresses" group displays:
  - Street, City, Zip Code (billing)
- "Shipping Addresses" group displays:
  - Street, City, Zip Code, Note (shipping)
- Both address sections are clearly separated
- All data matches what was entered during creation

---

#### 3.7 Navigate Back to Overview from Customer Details

**Priority**: Medium  
**Test Type**: Navigation Testing

**Preconditions:**

- User is logged in
- User is viewing a customer details page

**Steps:**

1. Navigate to any customer details page (e.g., /customers/{id})
2. Click the "Back to Overview" link

**Expected Results:**

- User is navigated back to /customers page
- Customer list is displayed
- No data is lost
- User remains authenticated
- Previously viewed customer is visible in the list

---

#### 3.8 Direct URL Access to Customer Details

**Priority**: Medium  
**Test Type**: Navigation Testing

**Preconditions:**

- User is logged in
- A valid customer ID exists

**Steps:**

1. Copy a customer ID from the customers table URL
2. Navigate directly to http://localhost:5165/customers/{customer-id} using the address bar

**Expected Results:**

- Customer details page loads successfully
- Correct customer information is displayed
- Page behaves identically to accessing via "View Details" link
- "Back to Overview" link works correctly

---

#### 3.9 Invalid Customer ID Handling

**Priority**: Medium  
**Test Type**: Error Handling

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate directly to http://localhost:5165/customers/00000000-0000-0000-0000-000000000000 (invalid UUID)
2. Observe the page behavior

**Expected Results:**

- Error handling occurs gracefully
- Either:
  - Error message is displayed (e.g., "Customer not found")
  - 404 page is shown
  - User is redirected to customers list
- Application does not crash
- User remains authenticated

---

### 4. Navigation and User Experience

#### 4.1 Navigation Between Pages

**Priority**: High  
**Test Type**: Navigation Testing

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165
2. Click "Customers" link → verify /customers page loads
3. Click "Current User" link → verify /user page loads
4. Click "Customers" link again → verify /customers page loads
5. Click a customer's "View Details" → verify customer details page loads
6. Click "Back to Overview" → verify /customers page loads

**Expected Results:**

- All navigation links work correctly
- Active page is highlighted in navigation (if implemented)
- Page transitions are smooth
- No console errors occur
- User authentication persists throughout navigation

---

#### 4.2 Browser Back Button Functionality

**Priority**: Medium  
**Test Type**: Browser Compatibility

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Click on a customer's "View Details"
3. Click browser back button
4. Verify you're back on customers list
5. Click browser forward button
6. Verify you're back on customer details

**Expected Results:**

- Browser back/forward buttons work as expected
- Navigation history is maintained
- Pages reload correctly
- No authentication issues occur
- Data is refreshed appropriately

---

#### 4.3 Page Refresh Maintains Application State

**Priority**: Medium  
**Test Type**: State Management

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Refresh the page (F5 or browser refresh)
3. Navigate to a customer details page
4. Refresh the page again
5. Navigate to /user page
6. Refresh the page

**Expected Results:**

- User remains authenticated after each refresh
- Current page state is maintained or appropriately reset
- No errors occur
- Data is reloaded correctly
- Session persists

---

#### 4.4 Responsive Design - Table Display

**Priority**: Low  
**Test Type**: UI/UX Testing

**Preconditions:**

- User is logged in
- Multiple customers exist

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Resize browser window to various widths:
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)
3. Observe table layout and form display at each size

**Expected Results:**

- Table remains usable at all screen sizes
- Horizontal scrolling is available if needed
- Form fields stack appropriately on smaller screens
- No content is cut off or inaccessible
- Touch targets are adequately sized for mobile

---

### 5. Error Handling and Edge Cases

#### 5.1 Form Submission During API Failure

**Priority**: High  
**Test Type**: Error Handling

**Preconditions:**

- User is logged in
- API is temporarily unavailable or returns error

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Fill out customer form with valid data
3. Stop the API service (if possible in test environment)
4. Click "Create Customer" button
5. Observe error handling

**Expected Results:**

- User-friendly error message is displayed
- Message indicates the issue (e.g., "An unexpected error occurred, please try again.")
- Form data is preserved (not cleared)
- User can retry submission
- No console errors that reveal sensitive information
- Application remains stable

---

#### 5.2 Session Expiration Handling

**Priority**: High  
**Test Type**: Security Testing

**Preconditions:**

- User is logged in
- Session timeout is configured

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Wait for session to expire (or manipulate session manually)
3. Attempt to perform an action (e.g., create customer)

**Expected Results:**

- User is redirected to login page when session expires
- Appropriate message about session expiration (if implemented)
- After re-login, user is redirected back to intended page
- No data corruption occurs
- No sensitive data is exposed

---

#### 5.3 Concurrent User Actions

**Priority**: Low  
**Test Type**: Concurrency Testing

**Preconditions:**

- User is logged in
- Second browser tab/window is available

**Steps:**

1. Open application in two browser tabs
2. Login in both tabs
3. In Tab 1: Navigate to /customers
4. In Tab 2: Create a new customer
5. In Tab 1: Click refresh button to reload customer list
6. Verify new customer appears in Tab 1

**Expected Results:**

- Both tabs can operate independently
- Data synchronization occurs correctly
- Refresh functionality works across tabs
- No conflicts or errors occur
- Authentication is maintained in both tabs

---

#### 5.4 Special Characters in Form Input

**Priority**: Medium  
**Test Type**: Input Validation

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. In the "Create Customer" form, enter:
   - First Name: "O'Brien"
   - Last Name: "Müller-Schmidt"
3. Check "Add Billing Address"
4. In Billing Address:
   - Street: "123 St. John's Rd., Apt #4"
   - City: "São Paulo"
   - Zip Code: "12-345"
5. Submit the form

**Expected Results:**

- Special characters are accepted and properly stored
- Customer is created successfully
- No encoding issues occur
- Customer details page displays characters correctly
- Data integrity is maintained
- No SQL injection or XSS vulnerabilities

---

#### 5.5 Very Long Input Strings

**Priority**: Low  
**Test Type**: Boundary Testing

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Enter very long strings (500+ characters) in:
   - First Name field
   - Last Name field
   - Address fields (if no max length is enforced)
3. Attempt to submit the form

**Expected Results:**

- Either maximum length is enforced by UI
- Or backend validates and returns appropriate error
- Error message is clear and helpful
- Application doesn't crash or hang
- No database errors occur

---

### 6. Performance and Scalability

#### 6.1 Customer List Load Time with Large Dataset

**Priority**: Medium  
**Test Type**: Performance Testing

**Preconditions:**

- Database contains 100+ customers
- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Measure page load time
3. Observe initial render performance

**Expected Results:**

- Page loads within acceptable time (< 3 seconds)
- Initial customer list renders without lag
- Scrolling through list is smooth
- No browser performance warnings
- Pagination or virtual scrolling implemented if list is very long

---

#### 6.2 Form Submission Performance

**Priority**: Low  
**Test Type**: Performance Testing

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Fill out complete customer form with both addresses
3. Click "Create Customer" button
4. Measure time from click to customer appearing in list

**Expected Results:**

- Form submission completes within 2-3 seconds
- User receives immediate feedback (loading state)
- Customer appears in list promptly after creation
- No performance degradation with multiple addresses
- Form resets quickly

---

### 7. Accessibility

#### 7.1 Keyboard Navigation

**Priority**: High  
**Test Type**: Accessibility Testing

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Use Tab key to navigate through all form fields
3. Use Enter key to submit form
4. Use Tab to navigate to customer links
5. Use Enter to activate "View Details" link
6. Use Tab to reach "Back to Overview" link

**Expected Results:**

- All interactive elements are reachable via keyboard
- Tab order is logical and intuitive
- Focus indicators are clearly visible
- Enter key activates buttons and links
- No keyboard traps exist
- Skip navigation links available (if implemented)

---

#### 7.2 Screen Reader Compatibility

**Priority**: High  
**Test Type**: Accessibility Testing

**Preconditions:**

- User is logged in
- Screen reader is active (e.g., NVDA, JAWS, VoiceOver)

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Use screen reader to navigate form fields
3. Listen to form field labels and instructions
4. Navigate to customer table
5. Listen to table structure and content
6. Navigate to customer details page

**Expected Results:**

- All form fields have proper labels
- Required fields are announced
- Error messages are announced
- Table structure is properly announced
- Headings create logical document outline
- ARIA labels are used where appropriate
- Images have alt text

---

#### 7.3 Form Labels and Error Associations

**Priority**: High  
**Test Type**: Accessibility Testing

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Inspect form fields with browser dev tools
3. Check for proper label associations
4. Trigger validation errors
5. Inspect error message associations

**Expected Results:**

- All form fields have associated `<label>` elements
- Labels use proper `for` attribute or wrap inputs
- Error messages are associated with inputs (aria-describedby)
- Validation errors are announced to screen readers
- Required fields are marked (required attribute or aria-required)
- Fieldsets group related inputs (address sections)

---

### 8. Security Testing

#### 8.1 XSS Prevention in Customer Names

**Priority**: Critical  
**Test Type**: Security Testing

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Attempt to create customer with XSS payload:
   - First Name: `<script>alert('XSS')</script>`
   - Last Name: `"><img src=x onerror=alert('XSS')>`
3. Submit form
4. View customer in list and details page

**Expected Results:**

- XSS payload is not executed
- Script tags are escaped or sanitized
- Customer name displays as plain text
- No alert boxes appear
- HTML is properly encoded
- No JavaScript execution occurs

---

#### 8.2 SQL Injection Prevention

**Priority**: Critical  
**Test Type**: Security Testing

**Preconditions:**

- User is logged in

**Steps:**

1. Navigate to http://localhost:5165/customers
2. Attempt to create customer with SQL injection payload:
   - First Name: `Robert'; DROP TABLE Customers; --`
   - Last Name: `' OR '1'='1`
3. Submit form
4. Verify database integrity

**Expected Results:**

- Input is properly parameterized
- No SQL injection occurs
- Customer is created with literal string values
- Database tables remain intact
- Application continues functioning normally
- No database errors are visible to user

---

#### 8.3 CSRF Protection

**Priority**: Critical  
**Test Type**: Security Testing

**Preconditions:**

- User is logged in
- CSRF protection is implemented

**Steps:**

1. Open browser dev tools and inspect form submission
2. Look for CSRF tokens in requests
3. Attempt to submit form from external site (if possible in test env)

**Expected Results:**

- CSRF tokens are present in form submissions
- Requests without valid tokens are rejected
- Tokens are unique per session
- Gateway properly validates anti-forgery tokens
- Cross-origin requests are properly restricted

---

#### 8.4 Authorization - Direct Object Reference

**Priority**: High  
**Test Type**: Security Testing

**Preconditions:**

- User is logged in
- Multiple customers exist

**Steps:**

1. Navigate to a customer details page
2. Note the customer ID in the URL
3. Manually modify the ID to another customer's ID
4. Verify access is granted (assuming all authenticated users can view all customers)
5. Attempt to access with non-existent ID

**Expected Results:**

- User can view all customers (if that's the intended behavior)
- Or: Proper authorization checks prevent unauthorized access
- Invalid IDs return 404 or redirect gracefully
- No sensitive information is leaked in error messages
- User cannot access other users' data (if multi-tenancy is implemented)

---

### 9. Integration Testing

#### 9.1 End-to-End Customer Lifecycle

**Priority**: Critical  
**Test Type**: Integration Testing

**Steps:**

1. Login to application
2. Navigate to customers page
3. Create new customer with billing address
4. Verify customer appears in list
5. Click "View Details" for new customer
6. Verify all customer data is correctly displayed
7. Click "Back to Overview"
8. Refresh the customer list
9. Verify customer still appears
10. Logout and login again
11. Navigate to customers page
12. Verify customer still exists

**Expected Results:**

- Complete workflow executes without errors
- Data persists correctly through all operations
- Authentication is maintained throughout
- All data is correctly saved and retrieved
- UI updates reflect backend state

---

#### 9.2 Multiple Customers Creation Flow

**Priority**: High  
**Test Type**: Integration Testing

**Steps:**

1. Login to application
2. Navigate to customers page
3. Create customer #1 with billing address only
4. Verify customer #1 appears in list
5. Create customer #2 with shipping address only
6. Verify both customers appear in list
7. Create customer #3 with both addresses
8. Verify all three customers appear in list
9. View details for each customer
10. Verify each has correct address configuration

**Expected Results:**

- All three customers are created successfully
- Each has correct address configuration
- Customer list displays all customers
- No data mixing between customers occurs
- Form resets properly between submissions
- Performance remains acceptable with multiple operations

---

#### 9.3 Authentication Integration with API Calls

**Priority**: Critical  
**Test Type**: Integration Testing

**Steps:**

1. Login to application
2. Open browser dev tools (Network tab)
3. Navigate to customers page
4. Observe API requests
5. Create a new customer
6. Observe API request for creation
7. View customer details
8. Observe API request for details

**Expected Results:**

- All API requests include proper authentication headers
- Bearer tokens are automatically added by gateway
- No 401 Unauthorized errors occur
- XSRF tokens are present (if implemented)
- Cookies are properly included
- No authentication tokens are exposed in console/logs

---

## Test Data Requirements

### Users

- **testuser** / **password123** - Standard test user with full access

### Pre-populated Customers (Optional)

- Alice Smith (no addresses)
- Charlie Brown (billing address only)
- Bob Johnson (shipping address only)

### Test Addresses

- **Billing Address 1**: 123 Main Street, Springfield, 12345
- **Billing Address 2**: 789 Elm Street, Portland, 97201
- **Shipping Address 1**: 456 Oak Avenue, Riverside, 54321
- **Shipping Address 2**: 321 Pine Road, Seattle, 98101

---

## Environment Requirements

### Required Services

- ✅ Sandbox.Gateway (API Gateway) - Running on http://localhost:5165
- ✅ Sandbox.ApiService (Backend API) - Running and accessible via gateway
- ✅ PostgreSQL Database - Running and initialized with schema
- ✅ Keycloak - Running with Sandbox Realm configured
- ✅ Angular Frontend - Built and served via gateway

### Configuration

- Keycloak realm: "sandbox"
- Test user: "testuser" with password "password123"
- Database: Clean state or with known test data
- CORS properly configured
- OIDC settings configured correctly

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest, if applicable)

---

## Test Execution Notes

### Before Test Run

1. Ensure all services are running via Aspire (`dotnet run --project ./Sandbox.AppHost`)
2. Verify Keycloak is accessible and test user exists
3. Confirm database is in expected state
4. Check that application loads at http://localhost:5165

### During Test Execution

- Use browser dev tools to monitor console for errors
- Check network tab for failed requests
- Verify no memory leaks occur during long test runs
- Monitor API response times

### After Test Run

- Review test results and logs
- Document any unexpected behaviors
- Update test plan based on findings
- Clean up test data if necessary

---

## Automation Recommendations

### High Priority for Automation

- Test 1.1: Successful User Login
- Test 1.3: User Logout
- Test 2.1: Create Customer with Required Fields
- Test 2.2: Create Customer with Billing Address
- Test 2.4: Create Customer with Both Addresses
- Test 2.5: Form Validation - Missing Required Fields
- Test 3.1: View Customer List
- Test 3.6: View Customer Details - Both Addresses
- Test 9.1: End-to-End Customer Lifecycle

### Medium Priority for Automation

- All validation tests (2.6-2.11)
- Navigation tests (4.1-4.3)
- Error handling tests (5.1-5.3)
- Accessibility basics (7.1)

### Manual Testing Recommended

- Visual/UI responsiveness (4.4)
- Screen reader testing (7.2)
- Performance testing (6.1-6.2)
- Security penetration testing (8.1-8.4)
- Exploratory testing for edge cases

---

## Success Criteria

### Critical Tests (Must Pass)

- All authentication flows (1.1, 1.3, 1.4)
- Customer creation with all address combinations (2.1, 2.2, 2.4)
- Form validation prevents invalid submissions (2.5)
- Customer list display and details view (3.1, 3.6)
- End-to-end workflow (9.1)
- Security tests pass (8.1-8.3)

### Quality Gates

- ≥ 95% of critical tests passing
- ≥ 90% of high-priority tests passing
- Zero critical security issues
- Zero authentication/authorization failures
- Form validation 100% effective
- No data corruption issues

---

## Defect Reporting Template

When defects are found, report with:

**Title**: [Component] Brief description

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:

1. Step 1
2. Step 2
3. Step 3

**Expected Result**: What should happen

**Actual Result**: What actually happened

**Environment**: Browser, OS, Test data used

**Screenshots/Videos**: Attach if relevant

**Console Errors**: Include any console errors

**Additional Notes**: Any other relevant information

---

## Appendix: Test Scenario Mapping

### By Feature

- **Authentication**: Tests 1.1-1.6
- **Customer Creation**: Tests 2.1-2.11
- **Customer Viewing**: Tests 3.1-3.9
- **Navigation**: Tests 4.1-4.4
- **Error Handling**: Tests 5.1-5.6
- **Performance**: Tests 6.1-6.2
- **Accessibility**: Tests 7.1-7.3
- **Security**: Tests 8.1-8.4
- **Integration**: Tests 9.1-9.3

### By Priority

- **Critical**: 1.1, 1.3, 1.4, 2.1, 2.2, 2.5, 3.1, 8.1, 8.2, 8.3, 9.1
- **High**: 1.2, 1.5, 2.3, 2.4, 2.6, 3.2-3.6, 4.1, 5.1, 7.1, 7.2, 7.3, 8.4, 9.2, 9.3
- **Medium**: 1.6, 2.7-2.11, 3.7-3.9, 4.2, 4.3, 5.2, 5.3, 5.5, 6.1
- **Low**: 4.4, 5.4, 5.6, 6.2

### By Test Type

- **Happy Path**: 1.1, 1.3, 1.6, 2.1-2.4, 3.1, 3.3-3.6
- **Negative Testing**: 1.2, 1.4
- **Validation**: 2.5-2.9
- **Boundary**: 2.6-2.8, 5.6
- **UI/UX**: 2.10, 2.11, 4.4
- **Navigation**: 3.7, 3.8, 4.1-4.3
- **Error Handling**: 3.9, 5.1-5.6
- **Security**: 1.4, 8.1-8.4
- **Performance**: 6.1, 6.2
- **Accessibility**: 7.1-7.3
- **Integration**: 9.1-9.3

---

_Document Version: 1.0_  
_Last Updated: October 14, 2025_  
_Created By: Playwright Test Planner Agent_
