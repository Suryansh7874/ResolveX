# ResolveX

## Societal Innovation Collaboration Portal

ResolveX is a digital platform designed to connect **citizens, government, higher educational institutions, faculty, students, and industry partners** to identify societal challenges and convert them into research-backed, deployable solutions.

Instead of treating a societal problem as a simple complaint, ResolveX creates an end-to-end innovation pipeline:

```text
Citizen / Community / Government
              ↓
      Societal Challenge
              ↓
       AI Analysis
              ↓
 Government Validation
              ↓
        HEI Matching
              ↓
      HEI Acceptance
              ↓
    Faculty + Student Team
              ↓
        Proposal
              ↓
    Government Review
              ↓
          Project
              ↓
        Milestones
              ↓
 Industry Collaboration
              ↓
 Prototype / Testing
              ↓
           Pilot
              ↓
        Validation
              ↓
 Deployment / Technology Transfer
              ↓
       Measurable Impact
```

---

# 1. Problem Statement

Societal problems are often identified by citizens, communities, local bodies, and government departments, but there can be a gap between:

* identifying the problem,
* understanding the problem,
* finding the right academic expertise,
* developing a solution,
* obtaining industry support,
* testing and validating the solution,
* deploying it,
* and measuring its social impact.

ResolveX aims to provide a common digital platform connecting these stakeholders.

---

# 2. Core Objectives

ResolveX focuses on:

* Citizen and community challenge submission
* AI-assisted challenge analysis
* Government validation
* HEI matching
* Multidisciplinary team formation
* Research and solution proposals
* Government proposal review
* Project lifecycle management
* Milestones and documentation
* Industry collaboration
* Prototype and pilot support
* Deployment and technology transfer
* Social impact tracking
* Platform analytics
* Notifications and communication

---

# 3. Major Modules

## 3.1 Citizen Engagement

Citizens can submit societal challenges containing:

* Title
* Description
* Location
* Images
* Videos
* Supporting documents

The submitted challenge becomes part of the ResolveX innovation pipeline.

---

## 3.2 AI-Enabled Problem Management

ResolveX can use AI to assist with:

* Challenge categorization
* Priority identification
* Expertise extraction
* Technology extraction
* Keyword extraction
* Impact identification
* Innovation potential
* Duplicate detection
* HEI matching support

The purpose of AI is to help organize and route societal challenges efficiently.

---

## 3.3 Government Validation

Government acts as a validation and coordination layer.

Government can:

* Review submitted challenges
* Inspect AI analysis
* Validate challenges
* Reject unsuitable challenges
* Review potential duplicate information
* Review HEI matching
* Assign challenges to suitable HEIs
* Review solution proposals
* Approve proposals
* Request revisions
* Reject proposals
* Monitor projects
* Verify impact information

---

## 3.4 HEI Collaboration

Higher Educational Institutions can:

* View assigned challenges
* Accept or reject challenges
* Manage faculty and student members
* Form multidisciplinary teams
* Create proposals
* Submit proposals
* Manage projects
* Track milestones
* Maintain project documentation

---

## 3.5 Faculty and Student Collaboration

Faculty members act as academic/project mentors.

Faculty can:

* View assigned challenges
* Participate in teams
* Guide student teams
* Work with proposals
* Manage project activities
* Monitor milestones
* Contribute to project documentation

Students can:

* Participate in teams
* View challenges
* Work on projects
* View proposals
* Work on assigned milestones
* Upload permitted documentation
* Track project progress

---

## 3.6 Industry Partnership

Industry collaboration connects projects with external organizations.

Possible collaboration types include:

* Mentoring
* Funding
* Co-development
* Prototyping
* Pilot support
* Testing
* Technology transfer

Industry partners can discover relevant projects and participate in collaboration workflows.

---

## 3.7 Project Lifecycle Management

Approved proposals become projects.

The project lifecycle is:

```text
Approved Proposal
       ↓
Project Created
       ↓
Milestones
       ↓
Development
       ↓
Prototype
       ↓
Testing
       ↓
Pilot
       ↓
Validation
       ↓
Deployment
       ↓
Impact Measurement
```

Project management includes:

* Project overview
* Team
* Proposal
* Milestones
* Documentation
* Industry collaboration
* Prototype/pilot information
* Validation
* Deployment
* Impact

---

## 3.8 Impact Tracking

After implementation, projects can record:

* Deployment status
* Number of beneficiaries
* Communities reached
* Locations covered
* Measurable outcomes
* Impact summary
* Deployment challenges
* Supporting evidence

Government can verify submitted impact information.

---

## 3.9 Analytics

ResolveX analytics can provide information about:

### Challenges

* Total challenges
* Challenge status
* Challenge domains
* Priority distribution
* District distribution

### Proposals

* Submitted
* Approved
* Rejected
* Revision required

### Projects

* Total projects
* Active projects
* Completed projects
* Project status

### HEIs

* Number of HEIs
* HEI participation
* Projects by HEI

### Industry

* Industry partners
* Collaboration count
* Collaboration types
* Active collaborations
* Completed collaborations

### Impact

* Deployed projects
* Beneficiaries
* Communities reached
* Deployment status

---

# 4. User Roles

ResolveX currently uses the following roles:

```text
CITIZEN
GOVERNMENT
HEI_ADMIN
FACULTY
STUDENT
INDUSTRY
```

## CITIZEN

Can:

* Register
* Submit challenges
* View own challenges
* Track challenge progress
* View relevant challenge information
* Receive notifications

## GOVERNMENT

The Government role also represents the merged administrative/government control layer.

Can:

* Manage challenges
* Validate challenges
* Reject challenges
* Assign HEIs
* Review proposals
* Approve proposals
* Request revisions
* Reject proposals
* Monitor projects
* Verify impact
* View platform analytics

## HEI_ADMIN

Can:

* Manage assigned challenges
* Accept/reject challenges
* Manage HEI members
* Form project teams
* Manage proposals
* Manage projects

## FACULTY

Can:

* Participate in teams
* Guide projects
* Work with proposals
* Manage permitted project activities
* Monitor milestones

## STUDENT

Can:

* Participate in teams
* View assigned projects
* Work on permitted project activities
* Update assigned work
* Access project documents

## INDUSTRY

Can:

* Discover projects
* View collaboration opportunities
* Request collaboration
* Participate in active collaborations
* Provide support according to collaboration type

---

# 5. Frontend Dashboard Architecture

ResolveX uses role-based dashboards.

```text
ResolveX
   ↓
Authentication
   ↓
Role Detection
   ↓
├── Government Dashboard
├── Citizen Dashboard
├── HEI Admin Dashboard
├── Faculty Dashboard
├── Student Dashboard
└── Industry Dashboard
```

A common dashboard layout should be used across all roles.

Common components include:

* Navbar
* Sidebar
* Notification system
* Profile
* Cards
* Tables
* Filters
* Search
* Status badges
* Challenge details
* Project workspace

---

# 6. Project Workspace

The project workspace is shared by authorized project stakeholders.

```text
Project Workspace
│
├── Overview
├── Team
├── Proposal
├── Milestones
├── Documents
├── Industry Collaboration
├── Prototype
├── Pilot
├── Validation
├── Deployment
└── Impact
```

Permissions depend on the user's role.

For example:

```text
Government
→ Review / monitor / verify

HEI Admin
→ Manage project

Faculty
→ Guide / manage permitted project work

Student
→ Work on assigned activities

Industry
→ Participate in collaboration
```

---

# 7. Backend Architecture

The backend follows a typical Node.js + Express + MongoDB architecture.

```text
Client
  ↓
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Models
  ↓
MongoDB
```

### Routes

Routes define API endpoints.

### Middleware

Middleware handles things such as:

* Authentication
* JWT verification
* Role authorization
* Request processing

### Controllers

Controllers contain business logic.

Examples:

```text
challengeController
proposalController
projectController
milestoneController
projectDocumentationController
industryCollaborationController
projectImpactController
analyticsController
notificationController
```

### Models

Models define MongoDB document structures.

---

# 8. Dashboard Controllers

Dashboard controllers provide role-specific aggregated information to the frontend.

Example:

```text
GET /api/dashboard/government
```

can provide:

* Challenge counts
* Proposal counts
* Project counts
* Pending actions
* Industry collaboration information
* Impact information

The dashboard controller acts as a bridge between multiple backend models and the frontend dashboard.

---

# 9. Analytics Controller

Analytics are different from role-specific dashboards.

The analytics controller provides platform-level statistics.

Example:

```text
GET /api/analytics/overview
```

Possible response sections:

```text
summary
challenges
proposals
projects
universities
industry
impact
```

---

# 10. Major API Areas

The backend is organized around feature-specific API groups.

```text
/api/auth
/api/challenges
/api/proposals
/api/projects
/api/milestones
/api/project-documents
/api/industry-collaborations
/api/project-impact
/api/notifications
/api/analytics
/api/dashboard
```

Exact route names should be treated according to the currently mounted Express routes in the backend.

---

# 11. Notifications

Notifications provide communication between platform users.

Typical events include:

```text
Challenge Submitted
        ↓
Challenge Validated
        ↓
HEI Assigned
        ↓
HEI Accepted
        ↓
Team Formed
        ↓
Proposal Submitted
        ↓
Proposal Reviewed
        ↓
Project Created
        ↓
Milestone Updated
        ↓
Industry Collaboration
        ↓
Impact Submitted
        ↓
Impact Verified
```

Notifications are presented through a common notification component rather than requiring a separate dashboard.

---

# 12. Technology Stack

The backend is based around:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT authentication
* Multer/media handling
* AI-assisted processing
* REST APIs

The frontend is responsible for consuming the backend APIs and presenting role-specific dashboards.

---

# 13. Core Data Flow

```text
USER
 ↓
AUTHENTICATION
 ↓
CHALLENGE
 ↓
AI ANALYSIS
 ↓
GOVERNMENT VALIDATION
 ↓
HEI MATCHING
 ↓
HEI ACCEPTANCE
 ↓
TEAM FORMATION
 ↓
PROPOSAL
 ↓
GOVERNMENT REVIEW
 ↓
PROJECT
 ↓
MILESTONES
 ↓
DOCUMENTATION
 ↓
INDUSTRY COLLABORATION
 ↓
PROTOTYPE / PILOT
 ↓
VALIDATION
 ↓
DEPLOYMENT
 ↓
IMPACT
 ↓
ANALYTICS
```

---

# 14. Development Principles

ResolveX should follow these principles:

### 1. PS-first development

Every feature should directly support the original problem statement.

### 2. Modular architecture

Keep:

* Models
* Controllers
* Routes
* Middleware
* Utilities

separate.

### 3. Role-based access

Users should only receive functionality appropriate to their role.

### 4. Reusable frontend components

Use shared components wherever possible.

### 5. Project-centered workflow

Projects should connect:

```text
Challenge
+
HEI
+
Team
+
Proposal
+
Milestones
+
Documents
+
Industry
+
Impact
```

### 6. Avoid unnecessary complexity

ResolveX should not become a generic project-management platform. Features should remain connected to the societal innovation workflow.

---

# 15. Current Development Flow

The current implementation has progressed through:

```text
Citizen Challenge Submission
        ↓
AI Analysis
        ↓
Government Validation
        ↓
HEI Matching / Assignment
        ↓
HEI Acceptance
        ↓
Team Formation
        ↓
Proposal Submission
        ↓
Government Proposal Review
        ↓
Project Lifecycle
        ↓
Milestones
        ↓
Project Documentation
        ↓
Industry Collaboration
        ↓
Impact Tracking
        ↓
Analytics
```

---

# 16. Frontend Development Checklist

### Common

* [ ] Authentication
* [ ] Role-based routing
* [ ] Dashboard layout
* [ ] Navbar
* [ ] Sidebar
* [ ] Notifications
* [ ] Profile
* [ ] Loading states
* [ ] Error states
* [ ] Empty states

### Citizen

* [ ] Dashboard
* [ ] Submit Challenge
* [ ] My Challenges
* [ ] Challenge Details

### Government

* [ ] Dashboard
* [ ] Challenge Management
* [ ] Challenge Review
* [ ] HEI Matching
* [ ] HEI Assignment
* [ ] Proposal Review
* [ ] Project Monitoring
* [ ] Impact
* [ ] Analytics

### HEI Admin

* [ ] Dashboard
* [ ] Assigned Challenges
* [ ] Challenge Review
* [ ] Member Management
* [ ] Team Formation
* [ ] Proposal Management
* [ ] Project Workspace

### Faculty

* [ ] Dashboard
* [ ] Challenges
* [ ] Teams
* [ ] Projects
* [ ] Milestones
* [ ] Proposals

### Student

* [ ] Dashboard
* [ ] Teams
* [ ] Projects
* [ ] Milestones
* [ ] Documents

### Industry

* [ ] Dashboard
* [ ] Discover Projects
* [ ] Project Details
* [ ] Collaboration Requests
* [ ] Active Collaborations

### Project Workspace

* [ ] Overview
* [ ] Team
* [ ] Proposal
* [ ] Milestones
* [ ] Documents
* [Industry Collaboration]
* [ ] Prototype
* [ ] Pilot
* [ ] Validation
* [ ] Deployment
* [ ] Impact

---

# 17. Final ResolveX Vision

ResolveX connects the entire innovation lifecycle:

```text
                 SOCIETAL PROBLEM
                       │
                       ▼
                  CITIZEN
                       │
                       ▼
                GOVERNMENT
                       │
                       ▼
                    HEI
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          FACULTY             STUDENTS
             │                   │
             └─────────┬─────────┘
                       ▼
                    PROJECT
                       │
                       ▼
                  INDUSTRY
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          FUNDING    TESTING   MENTORING
             │         │         │
             └─────────┼─────────┘
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
                       │
                       ▼
                   ANALYTICS
```

**ResolveX is therefore not simply a challenge-reporting application. It is a structured pipeline for transforming societal challenges into collaborative, research-driven and potentially deployable solutions.**
