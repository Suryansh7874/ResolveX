# ResolveX 🚀

### Societal Innovation Collaboration & Challenge Management Platform

ResolveX is a smart digital platform designed to connect **citizens, government bodies, Higher Educational Institutions (HEIs), faculty, students, and industry stakeholders** to identify, validate, analyze, and solve real-world societal challenges.

The platform transforms a citizen-reported problem into a structured innovation opportunity by using **AI-based challenge analysis, institutional matching, stakeholder management, and workflow automation**.

> **Challenge ≠ Complaint**
>
> ResolveX is not simply a complaint-resolution system. It is designed as a **societal innovation ecosystem** where challenges can progress from identification → validation → institutional matching → research → collaboration → solution development.

---

# 🎯 Problem Statement

Many societal problems are identified by citizens, communities, and local bodies, but there is often no unified mechanism to:

* Collect challenges in a structured manner
* Categorize and prioritize them intelligently
* Identify suitable institutions capable of solving them
* Connect challenges with relevant faculty and student expertise
* Enable government validation and monitoring
* Facilitate collaboration with industries, startups, MSMEs and CSR organizations
* Track the development of solutions from proposal to deployment
* Measure the social impact of implemented solutions

ResolveX aims to provide this complete digital ecosystem.

---

# 🌟 Key Features Implemented

## 1. Authentication & User Management

### Citizen Registration

Citizens can create accounts using:

* Name
* Email
* Phone
* Password

Public registration automatically creates a:

```text
CITIZEN
```

account.

### Secure Login

The platform uses:

* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Token-based authorization

Authentication flow:

```text
Login
  ↓
Credentials verification
  ↓
JWT generation
  ↓
Bearer Token
  ↓
Protected API
  ↓
JWT verification
  ↓
Authenticated User
```

### Password Management

Implemented:

* Forgot password
* OTP generation
* OTP verification
* Password reset
* OTP expiry handling

### Role-Based Access Control

ResolveX supports the following roles:

```text
CITIZEN
GOVERNMENT
HEI_ADMIN
FACULTY
STUDENT
INDUSTRY
ADMIN
```

Protected APIs use role-based middleware to restrict access.

Example:

```text
ADMIN → Administrative operations

GOVERNMENT → Challenge validation and government operations

HEI_ADMIN → HEI member management

FACULTY / STUDENT → Academic participation

INDUSTRY → Industry collaboration

CITIZEN → Challenge submission and participation
```

Unauthorized users receive:

```text
401 → Authentication required
403 → Access denied
```

---

# 2. Administrative User Management

The platform separates **public citizen registration** from **institutional account provisioning**.

Only an administrator can create privileged accounts.

### Admin can create:

* Government accounts
* HEI Admin accounts
* Industry accounts
* Faculty accounts
* Student accounts

Endpoint:

```http
POST /api/users/create-account
```

### Government Account

Government accounts are associated with a specific department.

```text
Government User
      ↓
Department
```

The department must exist and be active.

### HEI-related Accounts

HEI Admin, Faculty and Student accounts are associated with a specific HEI.

```text
User
 └── heiId
       ↓
      HEI
```

This prevents users from being created without institutional association.

### Security

Public users cannot select privileged roles during normal registration.

This prevents a citizen from simply registering themselves as:

```text
ADMIN
GOVERNMENT
HEI_ADMIN
FACULTY
STUDENT
INDUSTRY
```

---

# 3. HEI Management

ResolveX maintains institutional profiles for Higher Educational Institutions.

An HEI can contain information such as:

* Name
* Type
* Description
* Location
* State
* District
* Website
* Disciplines
* Research areas
* Expertise
* Innovation facilities
* Mentoring capability
* Prototyping capability
* Pilot capability
* Deployment capability

Supported HEI types:

```text
UNIVERSITY
COLLEGE
RESEARCH_INSTITUTE
INNOVATION_CENTER
OTHER
```

HEIs can be filtered based on:

* State
* District
* Type

---

# 4. HEI Member Management

ResolveX separates the **User account** from the **institutional academic profile**.

For example:

```text
User
 ├── name
 ├── email
 ├── role = FACULTY
 └── heiId

        +

HEIMember
 ├── department
 ├── designation
 ├── expertise
 ├── researchAreas
 └── skills
```

### HEI Admin Registration Flow

```text
ADMIN
  ↓
Creates Faculty/Student User
  ↓
Assigns HEI
  ↓
HEI_ADMIN
  ↓
Registers the existing User
  ↓
HEIMember profile created
```

### Faculty Profile

Can contain:

* Department
* Designation
* Expertise
* Research areas
* Skills
* Project availability

### Student Profile

Can contain:

* Department
* Designation
* Expertise
* Research areas
* Skills
* Project availability

### Security Checks

The system verifies that:

* User exists
* User role matches member type
* User belongs to the same HEI
* HEI is active
* Duplicate HEI membership does not already exist

Example:

```text
HEI_ADMIN of HEI A
        ↓
tries to register
        ↓
Student belonging to HEI B
        ↓
❌ Access denied
```

---

# 5. Societal Challenge Submission

Citizens can submit societal challenges containing:

* Title
* Description
* Domain
* Location
* Image
* Video
* Supporting documents

The challenge system uses geographic information in **GeoJSON Point format**.

Coordinates are stored as:

```text
[longitude, latitude]
```

### Location Validation

The backend validates:

```text
Latitude  → -90 to +90
Longitude → -180 to +180
```

Invalid coordinates are rejected.

### Challenge Status

The current lifecycle supports:

```text
SUBMITTED
     ↓
UNDER_REVIEW
     ↓
VALIDATED
     ↓
MATCHED
     ↓
IN_PROJECT
     ↓
RESOLVED
```

Challenges can also be:

```text
REJECTED
```

---

# 6. Media Upload

Challenge submission supports:

### Images

* JPG
* JPEG
* PNG

### Videos

* MP4
* WEBM

Files are stored through Multer in the server's:

```text
/uploads
```

directory.

Uploaded files are exposed through:

```http
/uploads/<filename>
```

The current upload size limit is:

```text
50 MB
```

---

# 7. Supporting Documents

The Challenge data model already supports supporting documents through:

```text
supportingDocuments
 ├── name
 ├── url
 └── type
```

Supported document MIME types have also been added to the upload middleware:

* PDF
* DOC
* DOCX

### Current Status

```text
Upload middleware       ✅
Challenge model         ✅
Route/controller handling 🚧 In progress
```

The final document submission flow will be completed separately.

---

# 8. AI-Based Challenge Analysis 🤖

ResolveX uses AI to automatically analyze submitted challenges.

The AI analyzes:

* Challenge domain
* Sub-domain
* Summary
* Priority
* Impact level
* Innovation potential
* Required expertise
* Required technologies
* Keywords

### Supported Challenge Domains

```text
EDUCATION
HEALTHCARE
AGRICULTURE
WATER_RESOURCES
SANITATION
ENVIRONMENT
ENERGY
RURAL_LIVELIHOODS
URBAN_DEVELOPMENT
ACCESSIBILITY
PUBLIC_ADMINISTRATION
DIGITAL_SERVICES
TRANSPORTATION
DISASTER_MANAGEMENT
OTHER
```

### Example

A challenge such as:

```text
"Villages are facing difficulty monitoring groundwater levels."
```

can be analyzed into information such as:

```text
Domain:
WATER_RESOURCES

Required Expertise:
IoT
Water Monitoring
Data Analytics

Technologies:
IoT Sensors
Machine Learning

Innovation Potential:
HIGH
```

This structured AI information is later used for institutional matching.

---

# 9. Challenge Discovery

Users can retrieve challenges through multiple APIs.

Supported functionality:

* Get all challenges
* Get challenge by ID
* Get user's own challenges
* Filter by domain
* Filter by status
* Filter by priority

Challenges are sorted by creation time where applicable.

---

# 10. Challenge Support / Community Engagement

Users can support challenges.

Each challenge maintains a list of supporting users.

The system prevents the same user from supporting the same challenge multiple times.

Example:

```text
Challenge
   ↓
User A → Support
User B → Support
User C → Support
   ↓
Support Count = 3
```

This helps identify challenges that have stronger community interest.

---

# 11. Duplicate Challenge Detection

ResolveX currently supports geographic duplicate detection.

The system checks for nearby challenges using MongoDB's geospatial capabilities.

Current search radius:

```text
50 meters
```

The system can identify potential duplicate challenges based on:

* Domain
* Geographic proximity

Example:

```text
Challenge A
Location: Point X

        ↓ 50m radius

Challenge B
Location: Point X

        ↓

Potential Duplicate
```

---

# 12. Challenge Validation

Government users and administrators can validate or reject challenges.

Only authorized roles can perform this operation.

```text
GOVERNMENT
ADMIN
```

### Validation

When approved:

```text
SUBMITTED
   ↓
VALIDATED
```

The system stores:

* Validation status
* Validated by
* Validation timestamp
* Validation notes

### Rejection

When rejected:

```text
SUBMITTED
   ↓
REJECTED
```

The system stores:

* Rejection status
* Rejection reason
* Validation notes
* Reviewing user
* Timestamp

---

# 13. AI-Based HEI Matching 🎯

Validated challenges can be matched with suitable HEIs.

The matching engine considers:

### Expertise

Matches AI-required expertise with:

* HEI expertise
* HEI research areas
* HEI disciplines

### Research Areas

The system checks compatibility between:

```text
Challenge requirements
        ↓
HEI research areas
```

### Disciplines

Challenge domains are compared against institutional disciplines and research areas.

### Technology & Facilities

The system also considers:

* Innovation facilities
* Technologies
* Institutional expertise

### Matching Score

Each HEI receives a matching score.

Example:

```text
HEI A → 85
HEI B → 70
HEI C → 45
```

Results are returned in descending order.

```text
Highest Match
      ↓
HEI A
      ↓
HEI B
      ↓
HEI C
      ↓
Lowest Match
```

This creates the foundation for future challenge allocation and multidisciplinary team formation.

---

# 14. Notifications 🔔

A notification system has been implemented.

Supported functionality includes:

* Notification generation
* Correct recipient assignment
* Notification retrieval
* Read/unread status
* Marking notifications as read

The system is designed to notify relevant stakeholders as challenges move through the platform workflow.

---

# 15. API Security

ResolveX uses several backend security mechanisms.

### JWT Authentication

Protected endpoints require:

```http
Authorization: Bearer <JWT>
```

### Role-Based Authorization

Example:

```text
ADMIN
   ↓
Administrative APIs

HEI_ADMIN
   ↓
HEI member APIs

GOVERNMENT
   ↓
Challenge validation APIs
```

### Password Security

Passwords are hashed using:

```text
bcrypt
```

Plain-text passwords are never stored.

### HTTP Security

The application uses:

```text
Helmet
CORS
Express JSON parsing
```

---

# 16. Current Backend Architecture

```text
                    ResolveX Backend
                           │
                           ▼
                      Express.js
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   Authentication      Challenges          HEIs
        │                  │                  │
        ▼                  ▼                  ▼
      JWT              AI Analysis       HEI Members
        │                  │                  │
        └──────────────┬───┴──────────────────┘
                       │
                       ▼
                    MongoDB
                       │
                       ▼
              Notification System
```

---

# 17. Main API Modules

| Module         | Endpoint             |
| -------------- | -------------------- |
| Authentication | `/api/auth`          |
| Departments    | `/api/departments`   |
| Challenges     | `/api/challenges`    |
| HEIs           | `/api/hei`           |
| HEI Members    | `/api/hei-members`   |
| Users          | `/api/users`         |
| AI             | `/api/ai`            |
| Voice          | `/api/voice`         |
| Notifications  | `/api/notifications` |

Uploaded media:

```text
/uploads
```

Health check:

```http
GET /api/health
```

---

# 18. Technology Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication & Security

* JWT
* bcrypt
* Helmet
* CORS

## AI

* Google Gemini API

## File Handling

* Multer
* Local file storage

## Database

* MongoDB
* MongoDB Geospatial Indexing

---

# 19. Database Models

Current major models include:

```text
User
Department
HEI
HEIMember
Challenge
Notification
```

### User

Handles:

* Authentication
* Roles
* Department association
* HEI association
* Account status

### HEI

Handles:

* Institutional information
* Disciplines
* Research areas
* Expertise
* Innovation facilities
* Mentoring/prototyping/pilot/deployment capabilities

### HEIMember

Handles:

* Faculty profiles
* Student profiles
* Expertise
* Research areas
* Skills
* Department
* Designation

### Challenge

Handles:

* Citizen-submitted challenges
* AI analysis
* Location
* Media
* Priority
* Validation
* Community support
* Status

---

# 20. Implemented Workflow

The current implemented workflow is:

```text
                  CITIZEN
                     │
                     ▼
             Submit Challenge
                     │
                     ├── Image
                     ├── Video
                     ├── Location
                     └── Description
                     │
                     ▼
                AI Analysis
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Domain      Priority     Expertise
        │            │            │
        └────────────┼────────────┘
                     ▼
             Challenge Storage
                     │
                     ▼
             Government Review
                │         │
             Reject      Validate
                │         │
                │         ▼
                │    HEI Matching
                │         │
                │         ▼
                │   Suitable HEIs
                │
                ▼
              Rejected
```

---

# 21. Institutional Onboarding Workflow

```text
                    ADMIN
                      │
          ┌───────────┼────────────┐
          ▼           ▼            ▼
     GOVERNMENT    HEI_ADMIN    INDUSTRY
                      │
                      ▼
               Existing HEI
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
       FACULTY                  STUDENT
          │                       │
          └───────────┬───────────┘
                      ▼
                  HEIMember
                      │
             ┌────────┼────────┐
             ▼        ▼        ▼
          Skills  Expertise  Research
```

---

# 22. Current Implementation Status

### ✅ Implemented

* Citizen registration
* Citizen login
* JWT authentication
* Protected routes
* Role-based access control
* Password reset workflow
* Admin-managed privileged accounts
* Government account management
* HEI Admin account management
* Industry account management
* Faculty account management
* Student account management
* Department association
* HEI association
* HEI management
* HEI filtering
* Faculty registration
* Student registration
* Faculty/Student expertise profiles
* Faculty/Student research profiles
* Faculty/Student skill profiles
* Challenge submission
* Image upload
* Video upload
* Location validation
* GeoJSON storage
* Challenge retrieval
* Challenge filtering
* Citizen's own challenges
* Challenge deletion
* Community support
* Geographic duplicate detection
* AI challenge categorization
* AI summary
* AI priority
* AI impact analysis
* AI innovation analysis
* AI expertise extraction
* AI technology extraction
* AI keyword extraction
* Government challenge validation
* Government challenge rejection
* Validation notes
* Rejection reasons
* HEI matching
* Expertise-based matching
* Research-based matching
* Discipline-based matching
* Technology/facility matching
* HEI matching score
* Ranked HEI results
* Notification system
* Read/unread notifications
* Backend security and authorization

### 🚧 Currently In Progress

* Supporting document submission through the challenge upload route

---

# 23. Planned Core Features

The next major development phase will extend the current validated challenge into a complete innovation lifecycle.

### Challenge → HEI

* HEI accepts validated challenge
* Challenge allocation to HEI
* HEI assigned challenge dashboard

### Team Formation

* Multidisciplinary team creation
* Faculty mentor assignment
* Student team members
* Team management
* Challenge-team association

### Solution Proposal

* Solution proposal submission
* Proposal review
* Proposal approval/rejection
* Proposal version management

### Project Lifecycle

```text
Approved Proposal
       ↓
Project Creation
       ↓
Milestones
       ↓
Prototype
       ↓
Pilot
       ↓
Validation
       ↓
Deployment
       ↓
Completion
```

### Industry Collaboration

* Industry discovery
* Collaboration requests
* Mentorship
* Technical support
* Funding / CSR support
* Prototype support
* Testing support
* Deployment support

### Government Analytics

Future dashboards will provide:

* Total challenges
* Domain distribution
* Institutional participation
* Industry participation
* Project progress
* Challenge-to-project conversion
* Social impact metrics

---

# 24. Future Advanced Features

Planned advanced capabilities include:

* Semantic duplicate detection
* Advanced semantic HEI matching
* Faculty/student expertise matching
* AI-assisted proposal generation
* AI-based impact prediction
* Advanced analytics
* GIS-based challenge visualization
* Solution reuse and knowledge repository
* Funding management
* Patent/startup tracking
* Mobile application
* Advanced project monitoring

---

# 25. Project Vision

ResolveX aims to create a continuous innovation pipeline:

```text
             SOCIETAL CHALLENGE
                     │
                     ▼
                AI ANALYSIS
                     │
                     ▼
             GOVERNMENT VALIDATION
                     │
                     ▼
                HEI MATCHING
                     │
                     ▼
            MULTIDISCIPLINARY TEAM
                     │
                     ▼
              SOLUTION PROPOSAL
                     │
                     ▼
              INDUSTRY SUPPORT
                     │
                     ▼
                  PROJECT
                     │
                     ▼
                PROTOTYPE
                     │
                     ▼
                   PILOT
                     │
                     ▼
                VALIDATION
                     │
                     ▼
                DEPLOYMENT
                     │
                     ▼
               SOCIAL IMPACT
```

The long-term goal is to transform ResolveX from a challenge reporting platform into a **state-level societal innovation ecosystem** connecting problems with the people, institutions, technologies, and resources required to solve them.

---

# 👥 Stakeholders

ResolveX brings together:

### Citizens

Identify and submit societal challenges.

### Government

Validate challenges, monitor progress and analyze societal needs.

### HEIs

Evaluate challenges, conduct research and develop solutions.

### Faculty

Provide domain expertise, mentorship and research guidance.

### Students

Participate in multidisciplinary innovation and solution development.

### Industry / Startups / MSMEs

Provide technology, mentorship, funding, prototyping, testing and deployment support.

### Platform Administrators

Manage institutional onboarding, user roles and platform-level operations.

---

# 📌 Project Status

**Current Phase: Core Platform + AI + Institutional Matching**

The foundation of the ResolveX ecosystem has been implemented, including:

```text
Authentication
      +
Role Management
      +
Challenge Management
      +
AI Analysis
      +
Government Validation
      +
HEI Management
      +
Faculty/Student Profiles
      +
HEI Matching
      +
Notifications
```

The next major milestone is to connect validated challenges with **HEI acceptance → multidisciplinary team formation → proposal → project → industry collaboration → deployment**.

---

## 🚀 ResolveX

**From societal challenges to collaborative innovation.**
