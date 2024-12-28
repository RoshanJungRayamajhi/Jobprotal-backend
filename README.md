```markdown:backend/README.md
# Authentication API Documentation

## Base URL
```

http://localhost:8000/api/auth

````

## Endpoints

### 1. Register User
```http
POST /register
````

**Request Body:**

```json
{
  "fullname": "string (required)",
  "email": "string (required)",
  "phoneNumber": "number (required)",
  "password": "string (required)",
  "role": "string (required) - either 'student' or 'recruiter'"
}
```

**File Upload:**

- Field name: `file`
- Type: Image file for profile photo
- Format: jpg, jpeg, png

**Response:**

- Status: 200 (Success)

```json
{
  "message": "User registered",
  "success": true,
  "user": {
    // user object without password
  }
}
```

- Status: 400 (Error)

```json
{
  "message": "User already exists with this email",
  "success": false
}
```

- Status: 404 (Error)

```json
{
  "message": "Please enter all fields",
  "success": false
}
```

### 2. Login User

```http
POST /login
```

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)",
  "role": "string (required) - either 'student' or 'recruiter'"
}
```

**Response:**

- Status: 200 (Success)

```json
{
  "message": "Welcome back {username}",
  "success": true,
  "user": {
    // user object
  }
}
```

- Status: 404 (Error)

```json
{
  "message": "Please register first",
  "success": false
}
```

- Status: 400 (Error)

```json
{
  "message": "Account doesnot exist with current role",
  "success": false
}
```

### 3. Logout User

```http
GET /logout
```

**Response:**

- Status: 200 (Success)

```json
{
  "message": "Logout successfully",
  "success": true
}
```

### 4. Update Profile

```http
POST /update
```

**Authentication:**

- Requires valid JWT token in cookie

**Request Body:**

```json
{
  "fullname": "string (optional)",
  "email": "string (optional)",
  "phoneNumber": "number (optional)",
  "bio": "string (optional)",
  "skills": "string (optional) - comma-separated skills"
}
```

**File Upload:**

- Field name: `file`
- Type: PDF/DOC file for resume
- Format: pdf, doc, docx

**Response:**

- Status: 200 (Success)

```json
{
  "message": "User updated successfully",
  "success": true,
  "user": {
    // updated user object
  }
}
```

- Status: 404 (Error)

```json
{
  "message": "User not found",
  "success": false
}
```

- Status: 500 (Error)

```json
{
  "message": "User update failed",
  "success": false
}
```

## Authentication

- The API uses JWT (JSON Web Token) for authentication
- Token is stored in HTTP-only cookie
- Token expires in 15 days
- Protected routes require valid token in cookie

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "message": "Error message description",
  "success": false
}
```

# Job API Documentation

## Base URL
```
http://localhost:8000/api/job
```

## Endpoints

### 1. Create New Job
```http
POST /post
```

**Authentication:**
- Requires valid JWT token in cookie

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "requirements": "string (required) - comma-separated skills",
  "salary": "number (required)",
  "location": "string (required)",
  "jobType": "string (required)",
  "experience": "number (required)",
  "position": "number (required)",
  "company": "string (required) - company ID"
}
```

**Response:**

- Status: 200 (Success)
```json
{
  "message": "New job Created",
  "success": true,
  "job": {
    // job object
  },
  "companydet": {
    // company details
  }
}
```

- Status: 400 (Error)
```json
{
  "message": "All fields are required",
  "success": false
}
```

- Status: 404 (Error)
```json
{
  "message": "Company not found",
  "success": false
}
```

### 2. Get All Jobs
```http
GET /getall
```

**Query Parameters:**
- `keywords` (optional): Search terms for job title or description

**Response:**

- Status: 200 (Success)
```json
{
  "message": "job found",
  "success": true,
  "job": [
    // Array of job objects with populated company details
  ]
}
```

- Status: 404 (Error)
```json
{
  "message": "Jobs not found",
  "success": false
}
```

### 3. Get Job by ID
```http
GET /get/:id
```

**Parameters:**
- `id`: Job ID in URL path

**Response:**

- Status: 200 (Success)
```json
{
  "success": true,
  "job": {
    // Job object with populated company details
  }
}
```

- Status: 404 (Error)
```json
{
  "message": "Jobs not Found",
  "success": false
}
```

### 4. Get Admin's Jobs
```http
GET /get/adminjob
```

**Authentication:**
- Requires valid JWT token in cookie

**Response:**

- Status: 200 (Success)
```json
{
  "message": "job found",
  "success": true,
  "job": [
    // Array of jobs created by the admin
  ]
}
```

- Status: 400 (Error)
```json
{
  "message": "job not available",
  "success": false
}
```

## Job Object Structure

```json
{
  "title": "string",
  "description": "string",
  "requirements": ["string"],
  "salary": "number",
  "location": "string",
  "jobType": "string",
  "experience": "number",
  "position": "number",
  "company": {
    // Populated company object
  },
  "createdBy": "string (User ID)",
  "applications": ["Application IDs"],
  "applicants": ["User IDs"],
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Authentication

- The API uses JWT (JSON Web Token) for authentication
- Token is stored in HTTP-only cookie
- Protected routes require valid token in cookie
- Admin authentication is required for posting jobs

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "message": "Error message description",
  "success": false
}
```

# Application API Documentation

## Base URL
```
http://localhost:8000/api/application
```

## Endpoints

### 1. Apply for Job
```http
POST /apply/:id
```

**Authentication:**
- Requires valid JWT token in cookie

**Parameters:**
- `id`: Job ID in URL path

**Response:**

- Status: 200 (Success)
```json
{
  "message": "Job applied successfully.",
  "success": true,
  "job": {
    // job object with company details
  }
}
```

- Status: 400 (Error)
```json
{
  "message": "You have already applied for this job.",
  "success": false
}
```

- Status: 404 (Error)
```json
{
  "message": "Job not found.",
  "success": false
}
```

### 2. Get User's Applied Jobs
```http
GET /get
```

**Authentication:**
- Requires valid JWT token in cookie

**Response:**

- Status: 200 (Success)
```json
{
  "message": "applied job",
  "application": [
    {
      "job": {
        // job details with company information
      },
      "status": "pending",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

- Status: 404 (Error)
```json
{
  "message": "No application found",
  "success": false
}
```

### 3. Get Job Applicants (Admin Only)
```http
GET /get/:id
```

**Authentication:**
- Requires valid JWT token in cookie
- Only accessible by job creator

**Parameters:**
- `id`: Job ID in URL path

**Response:**

- Status: 200 (Success)
```json
{
  "message": "applicants found",
  "success": true,
  "applicant": [
    {
      "status": "pending",
      "job": "job_id",
      "applicant": {
        // applicant user details
      },
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

- Status: 404 (Error)
```json
{
  "message": "you are not authorized to view this job applicants",
  "success": false
}
```

### 4. Update Application Status
```http
POST /status/:id/update
```

**Authentication:**
- Requires valid JWT token in cookie
- Only accessible by job creator

**Parameters:**
- `id`: Application ID in URL path

**Request Body:**
```json
{
  "status": "string (required) - either 'pending', 'accepted', or 'rejected'"
}
```

**Response:**

- Status: 200 (Success)
```json
{
  "message": "Status Updated Successfully",
  "success": true,
  "application": {
    // updated application object
  }
}
```

- Status: 400 (Error)
```json
{
  "message": "Status required",
  "success": false
}
```

## Application Object Structure

```json
{
  "job": {
    "type": "ObjectId",
    "ref": "Job"
  },
  "applicant": {
    "type": "ObjectId",
    "ref": "User"
  },
  "status": {
    "type": "String",
    "enum": ["pending", "accepted", "rejected"],
    "default": "pending"
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Authentication

- The API uses JWT (JSON Web Token) for authentication
- Token is stored in HTTP-only cookie
- All endpoints require authentication
- Certain endpoints require the user to be the job creator

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "message": "Error message description",
  "success": false
}
```

# Company API Documentation

## Base URL
```
http://localhost:8000/api/company
```

## Endpoints

### 1. Register Company
```http
POST /register
```

**Authentication:**
- Requires valid JWT token in cookie

**Request Body:**
```json
{
  "name": "string (required)"
}
```

**Response:**

- Status: 201 (Success)
```json
{
  "message": "company registered",
  "success": true,
  "company": {
    // company object
  }
}
```

- Status: 400 (Error)
```json
{
  "message": "Company already exists",
  "success": false
}
```

- Status: 404 (Error)
```json
{
  "message": "Company name is required",
  "success": false
}
```

### 2. Get Admin's Companies
```http
GET /get
```

**Authentication:**
- Requires valid JWT token in cookie

**Response:**

- Status: 201 (Success)
```json
{
  "message": "company found",
  "success": true,
  "company": [
    // Array of company objects
  ]
}
```

- Status: 404 (Error)
```json
{
  "message": "company not found",
  "success": false
}
```

### 3. Get Company by ID
```http
GET /get/:id
```

**Authentication:**
- Requires valid JWT token in cookie

**Parameters:**
- `id`: Company ID in URL path

**Response:**

- Status: 200 (Success)
```json
{
  "message": "company found",
  "success": true,
  "company": {
    // company object
  }
}
```

- Status: 404 (Error)
```json
{
  "message": "company not found",
  "success": false
}
```

### 4. Update Company
```http
POST /update/:id
```

**Authentication:**
- Requires valid JWT token in cookie

**Parameters:**
- `id`: Company ID in URL path

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "website": "string (optional)",
  "location": "string (optional)"
}
```

**File Upload:**
- Field name: `file`
- Type: Image file for company logo
- Format: jpg, jpeg, png

**Response:**

- Status: 200 (Success)
```json
{
  "message": "Company successfully updated",
  "success": true,
  "company": {
    // updated company object
  }
}
```

- Status: 404 (Error)
```json
{
  "message": "Company not found",
  "success": false
}
```

- Status: 500 (Error)
```json
{
  "message": "An error occurred while updating the company",
  "success": false
}
```

## Company Object Structure

```json
{
  "name": "string",
  "description": "string",
  "website": "string",
  "location": "string",
  "creator": {
    "type": "ObjectId",
    "ref": "User"
  },
  "jobs": [
    {
      "type": "ObjectId",
      "ref": "Job"
    }
  ],
  "logo": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Authentication

- The API uses JWT (JSON Web Token) for authentication
- Token is stored in HTTP-only cookie
- All endpoints require authentication
- Company operations are restricted to authenticated users

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "message": "Error message description",
  "success": false
}
```