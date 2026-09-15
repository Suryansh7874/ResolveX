ResolveX🚀

AI-Powered Societal Innovation Collaboration Platform

ResolveX is a digital platform designed to bridge the gap between citizens, government, Higher Educational Institutions (HEIs), students, faculty, and industry to transform real-world societal challenges into structured innovation and research projects.

Instead of treating a problem as just a complaint that needs to be resolved, ResolveX treats it as a challenge that can be studied, validated, researched, and converted into an innovative solution.

---

💡 General Idea

Many societal problems are identified by citizens and local communities, but there is often no structured mechanism to connect these problems with institutions that have the expertise and resources to solve them.

ResolveX creates this missing bridge.

🔄 Core Ecosystem

REAL-WORLD SOCIETAL CHALLENGE
            ↓
         CITIZEN
            ↓
     SUBMIT CHALLENGE
            ↓
       AI ANALYSIS
            ↓
   ┌────────┼─────────┐
   ↓        ↓         ↓
Category  Priority  Expertise
            ↓
       GOVERNMENT
            ↓
     VALIDATE & ASSIGN
            ↓
           HEI
            ↓
     ACCEPT CHALLENGE
            ↓
    FACULTY + STUDENTS
            ↓
 FORM MULTIDISCIPLINARY TEAM
            ↓
         PROPOSAL
            ↓
     GOVERNMENT REVIEW
            ↓
   APPROVED / REJECTED /
   REVISION REQUIRED
            ↓
      PROJECT PHASE
            ↓
 INDUSTRY COLLABORATION
            ↓
 PROTOTYPE → PILOT → DEPLOYMENT
            ↓
       SOCIAL IMPACT

Goal: Create a complete Challenge → Research → Innovation → Implementation → Impact ecosystem.

---

🎯 Problem Statement

Societal challenges are often scattered across communities and government systems, while universities, researchers, students, startups, industries, and innovation centres possess expertise and resources that could potentially address them.

However, there is a lack of a unified platform that can:

- Capture societal challenges in a structured manner
- Understand and categorize challenges using AI
- Identify duplicate or similar challenges
- Match challenges with suitable HEIs
- Enable universities to form multidisciplinary teams
- Convert challenges into research/solution proposals
- Enable government evaluation and monitoring
- Connect projects with industry and startups
- Track project progress and eventual social impact

ResolveX aims to provide this complete digital ecosystem.

---

🚀 Current Core Features

1. 🔐 Citizen Registration & Authentication

ResolveX supports:

- User registration
- Login
- JWT-based authentication
- Password hashing using bcrypt
- Forgot password
- OTP-based password reset
- Password reset verification

Current Roles

- "CITIZEN"
- "GOVERNMENT"
- "HEI_ADMIN"
- "FACULTY"
- "STUDENT"
- "INDUSTRY"

Public registration is intended for citizens, while privileged institutional accounts are managed through the appropriate administrative workflow.

---

2. 📝 Societal Challenge Submission

Citizens can submit real-world societal challenges.

A challenge can contain:

- Title
- Description
- Domain
- Geographic location
- Images
- Videos
- Supporting documents

Supported Challenge Domains

- Education
- Healthcare
- Agriculture
- Water Resources
- Sanitation
- Environment
- Energy
- Rural Livelihoods
- Urban Development
- Accessibility
- Public Administration
- Digital Services
- Transportation
- Disaster Management
- Other

Challenges use GeoJSON Point coordinates, allowing the platform to work with location-based data.

---

3. 🤖 AI-Powered Challenge Analysis

ResolveX uses AI to analyze submitted challenges.

The AI can identify:

- Challenge summary
- Sub-domain
- Required expertise
- Required technologies
- Keywords
- Impact level
- Innovation potential

This transforms an unstructured citizen submission into structured information for validation and institutional matching.

Example

Citizen Submission
        ↓
"Water wastage in rural village"
        ↓
      AI Analysis
        ↓
Domain: WATER_RESOURCES

Required Expertise:
- IoT
- Embedded Systems
- Water Management

Technologies:
- Sensors
- IoT
- Data Analytics

Impact:
HIGH

---

4. 🔍 Automatic Duplicate Detection

Before a new challenge is created, ResolveX performs an automatic duplicate check.

The system considers:

- Challenge domain
- Geographic proximity
- Existing challenges within the configured proximity range

This helps prevent multiple users from submitting the same problem repeatedly.

A separate manual duplicate-check endpoint is also available.

---

5. 👍 Community Support

Users can support existing challenges.

Supported challenges are tracked through the "supportedBy" relationship.

This provides a basic mechanism for identifying challenges with broader community interest.

---

6. 🏛️ Government Validation

Government users act as the platform's primary validation and coordination authority.

Challenge Workflow

SUBMITTED
    ↓
UNDER_REVIEW
    ↓
VALIDATED

Or:

SUBMITTED
    ↓
REJECTED

Government validation information includes:

- Validator
- Validation timestamp
- Validation notes
- Rejection reason

---

7. 🧠 AI-Assisted HEI Matching

Once a challenge is validated, ResolveX can identify suitable Higher Educational Institutions (HEIs).

HEIs are evaluated using:

- Disciplines
- Research areas
- Expertise
- Innovation facilities
- Required expertise from AI analysis
- Required technologies
- Challenge domain

The matching engine generates a compatibility score.

Matching Process

Challenge
    ↓
Required Expertise
Required Technologies
Domain
    ↓
HEI Database
    ↓
Matching Algorithm
    ↓
Match Score
    ↓
Ranked HEIs

Example:

Challenge
    ↓
Embedded Systems Required
    ↓
MNNIT Allahabad
    ↓
Expertise Match
    ↓
Score: 20+

---

8. 🏛️ Government → HEI Assignment

Government users can assign a validated challenge to a specific HEI.

The challenge stores:

- Assigned HEI
- Government user who assigned it
- Assignment timestamp
- HEI acceptance status
- HEI response
- Remarks

Initial acceptance state:

PENDING

---

9. ✅ HEI Challenge Acceptance / Rejection

The assigned HEI can respond to a challenge.

Accept

MATCHED
   ↓
HEI ACCEPTED
   ↓
IN_PROJECT

Reject

MATCHED
   ↓
HEI REJECTED
   ↓
Government can reassign

When rejecting a challenge, the HEI must provide remarks.

---

10. 👥 HEI Member Management

HEI administrators can register existing faculty and student users as members of their institution.

Each HEI member can have:

- Department
- Designation
- Expertise
- Research areas
- Skills
- Project availability
- Member type

Supported Member Types

- "FACULTY"
- "STUDENT"

The system ensures that:

- The member belongs to the correct HEI
- The user's role matches the member type
- Duplicate membership is prevented
- Only active members are considered

---

11. 👨‍🏫👨‍🎓 Project Team Formation

Once an HEI accepts a challenge, it can form a project team.

A project team is linked directly to:

- Challenge
- HEI
- Team creator

Teams can contain:

- Faculty Members
- Student Members

Team States

- "FORMING"
- "ACTIVE"
- "COMPLETED"

The system verifies that selected members:

- Belong to the same HEI
- Are active HEI members
- Have the correct member type
- Are not duplicated within the team

---

12. 📄 Proposal Creation

After team formation, the HEI can create a structured proposal.

A proposal contains:

- Title
- Problem statement
- Proposed solution
- Objectives
- Methodology
- Expected outcomes
- Required technologies
- Estimated duration
- Required resources

The proposal is linked to:

- Challenge
- Project Team
- HEI
- Submitting User

Initial proposal status:

DRAFT

---

13. 📤 Proposal Submission

Once the proposal is ready, the HEI can submit it for evaluation.

DRAFT
  ↓
SUBMITTED

Only proposals in "DRAFT" state can be submitted.

---

14. 🏛️ Government Proposal Review

Government users can review submitted proposals.

Review States

- "APPROVED"
- "REJECTED"
- "REVISION_REQUIRED"

The review records:

- Reviewing government user
- Review timestamp
- Review remarks

Complete Proposal Workflow

DRAFT
  ↓
SUBMITTED
  ↓
UNDER_REVIEW
  ↓
┌──────────────┬──────────────┬────────────────────┐
↓              ↓              ↓
APPROVED     REJECTED    REVISION_REQUIRED

---

🔄 Complete Current Workflow

                    RESOLVEX
                       ↓
                    CITIZEN
                       ↓
               SUBMIT CHALLENGE
                       ↓
                  AI ANALYSIS
                       ↓
          ┌────────────┴────────────┐
          ↓                         ↓
   Categorization             Duplicate Check
          └────────────┬────────────┘
                       ↓
                  GOVERNMENT
                       ↓
                   VALIDATION
                  ↙️           ↘️
            VALIDATED        REJECTED
                 ↓
             HEI MATCHING
                 ↓
           MATCH SCORE / HEIs
                 ↓
         GOVERNMENT ASSIGNS HEI
                 ↓
               MATCHED
              ↙️       ↘️
          ACCEPT      REJECT
             ↓           ↓
       IN_PROJECT    REASSIGNMENT
             ↓
      FORM PROJECT TEAM
          ↙️       ↘️
     FACULTY     STUDENTS
          \       /
           \     /
        CREATE PROPOSAL
             ↓
           DRAFT
             ↓
           SUBMIT
             ↓
       GOVERNMENT REVIEW
        ↙️       ↓        ↘️
   APPROVED  REJECTED  REVISION_REQUIRED

---

🏗️ Current Backend Architecture

ResolveX currently follows a modular Node.js backend architecture.

Backend
│
├── Controllers
│   ├── Auth
│   ├── Challenge
│   ├── HEI
│   ├── HEI Member
│   ├── Project Team
│   └── Proposal
│
├── Models
│   ├── User
│   ├── Challenge
│   ├── HEI
│   ├── HEIMember
│   ├── ProjectTeam
│   └── Proposal
│
├── Routes
│   ├── Auth
│   ├── Challenges
│   ├── HEIs
│   ├── HEI Members
│   ├── Project Teams
│   └── Proposals
│
├── Middleware
│   ├── Authentication
│   └── Role Authorization
│
├── Services
│   ├── Authentication
│   ├── AI Analysis
│   ├── HEI Matching
│   └── Email / OTP
│
└── Database
    └── MongoDB

---

🔐 Role-Based Access Control

ResolveX uses authentication middleware and role-based authorization.

Role| Responsibilities
CITIZEN| Register/login, submit challenges, view own challenges, support challenges, track status
GOVERNMENT| Validate/reject challenges, match/assign HEIs, review proposals, coordinate institutions
HEI_ADMIN| View assigned challenges, accept/reject, register members, form teams, create/submit proposals
FACULTY| Participate as HEI project members
STUDENT| Participate as HEI project members
INDUSTRY| Future industry collaboration layer

---

🔗 Important Data Relationships

User
│
├──────────────► Challenge
│
├──────────────► HEIMember
│                     │
│                     ▼
│                    HEI
│
└──────────────► Proposal
                       │
                       ▼
                  ProjectTeam
                  │         │
                  ▼         ▼
               Faculty   Students

More specifically:

Challenge
│
├── submittedBy → User
├── assignedHEI → HEI
├── assignedBy → Government User
├── Proposal
└── ProjectTeam
      ├── Faculty
      └── Students

---

🧠 Design Philosophy

ResolveX follows five major principles.

1. Challenge ≠ Complaint

A challenge is not simply something to be fixed by a government department.

It is an opportunity for:

Research
   ↓
Innovation
   ↓
Collaboration
   ↓
Implementation

2. AI-Assisted Decision Making

AI is used to structure and analyze challenges, while institutional and government decisions remain controlled by authorized users.

3. Institution-Based Expertise

Challenges should reach institutions based on their:

- Research areas
- Expertise
- Disciplines
- Facilities
- Technology capabilities

4. Structured Workflow

Every major stage has a defined state rather than relying on informal communication.

5. Role-Based Collaboration

Citizen    → Identify Challenge
Government → Validate & Coordinate
HEI        → Research & Build
Faculty    → Guide
Students   → Develop
Industry   → Support

---

🛣️ Future Development Roadmap

The following features are planned/future scope, not part of the currently completed core backend.

Phase 1: Project Lifecycle

Approved Proposal
       ↓
Project Creation
       ↓
Milestones
       ↓
Progress Tracking
       ↓
Prototype
       ↓
Pilot
       ↓
Validation
       ↓
Deployment

Phase 2: Industry Collaboration

Industry/startups/MSMEs/CSR organizations can eventually:

- Discover suitable projects
- Request collaboration
- Provide mentorship
- Provide technical support
- Provide funding/CSR support
- Support prototyping
- Support testing
- Support deployment
- Participate in technology transfer

Phase 3: Project Workspace

A unified project workspace can contain:

- Overview
- Team
- Proposal
- Milestones
- Progress
- Industry Collaboration
- Prototype
- Validation
- Documents
- Updates
- Impact

The same workspace can be reused for different roles with role-specific permissions.

Phase 4: Notifications & Communication

A comprehensive notification layer can provide updates for:

- Challenge validation
- HEI assignment
- HEI acceptance/rejection
- Team formation
- Proposal submission
- Proposal review
- Project milestones
- Industry collaboration
- Project completion

Phase 5: Government Analytics

Government dashboards can eventually provide:

Total Challenges
       ↓
Domain Distribution
       ↓
Institutional Participation
       ↓
Industry Engagement
       ↓
Active Projects
       ↓
Project Progress
       ↓
Solutions Deployed
       ↓
Social Impact

The planned frontend architecture also uses role-based dashboards for citizens, government, HEIs, faculty, students, and industry.

---

🛠️ Technology Stack

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- REST APIs

AI

- Google Gemini API
- AI-powered challenge classification and analysis

Geospatial

- GeoJSON
- MongoDB 2dsphere indexing
- Location-based duplicate detection

Security

- JWT authentication
- Role-based authorization
- Password hashing
- OTP-based password recovery
- Protected institutional workflows

---

📊 Current MVP Status

✅ Implemented

- Authentication
- Role-based authorization
- Citizen registration/login
- Password recovery with OTP
- Challenge submission
- Media upload
- Supporting documents
- Location handling
- AI challenge analysis
- Challenge categorization
- AI-derived expertise/technology extraction
- Automatic duplicate detection
- Community support
- Government validation
- HEI management
- HEI member registration
- HEI matching
- Match scoring
- Government → HEI assignment
- HEI acceptance/rejection
- Project team formation
- Faculty/student team members
- Proposal creation
- Proposal draft
- Proposal submission
- Government proposal review
- Proposal approval/rejection/revision workflow

🚧 Planned

- Full project lifecycle
- Milestone management
- Industry collaboration
- Mentorship
- Funding/CSR workflow
- Prototype/pilot tracking
- Solution validation
- Deployment tracking
- Impact measurement
- Advanced analytics
- Expanded communication/notification workflows

---

🌍 Vision

ResolveX aims to evolve from a challenge reporting platform into a complete societal innovation ecosystem.

RESOLVEX
    ↓
REAL-WORLD PROBLEMS
    ↓
AI ANALYSIS
    ↓
GOVERNMENT VALIDATION
    ↓
HEI COLLABORATION
    ↓
FACULTY + STUDENT TEAMS
    ↓
RESEARCH
    ↓
INNOVATION
    ↓
INDUSTRY PARTNERSHIP
    ↓
PROTOTYPE / PILOT
    ↓
DEPLOYMENT
    ↓
SOCIAL IMPACT

🚀 ResolveX

From societal challenges to collaborative innovation.You can copy the content inside the block directly into README.md in your GitHub repository.
