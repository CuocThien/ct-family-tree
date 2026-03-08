# Requirement Document

**Project:** Family Tree V2
**Date:** 2026-03-07
**Version:** 1.0

---

## 1. Project Overview

### 1.1 Purpose

Family Tree V2 is a multi-family SaaS platform that enables families to create, manage, and share their genealogy and family history. The application provides comprehensive member profiles, relationship tracking, media management, and multiple visualization options.

### 1.2 Scope

- Multi-tenant family tree management
- Member profile management with extensive data fields
- Relationship tracking with calculated derived relationships
- Media management (photos, documents, videos)
- Source citations and timeline events
- Multiple tree visualization views
- Share links for public/private access
- User management with role-based access control

### 1.3 Target Users

| User Type | Description |
|-----------|-------------|
| Family Owner | Creates family, manages users, full access |
| Family Editor | Can add/edit members, relationships, media |
| Family Viewer | Read-only access to family tree |
| Guest | Views shared family tree via share link |

---

## 2. Functional Requirements

### 2.1 Authentication & Authorization

#### FR-AUTH-001: User Registration
- Users can register with username and password only
- No email or social login required
- Registration creates a new family with the user as Owner

#### FR-AUTH-002: User Login
- Users login with username and password
- JWT token issued on successful authentication
- Token expires after 7 days

#### FR-AUTH-003: Role-Based Access Control
| Role | Permissions |
|------|-------------|
| OWNER | Full CRUD + user management + sharing |
| EDITOR | CRUD for members, relationships, media, timeline |
| VIEWER | Read-only access |

#### FR-AUTH-004: Password Management
- Password requirements: 8+ chars, 1 uppercase, 1 lowercase, 1 number
- Family Owner can reset passwords for family members
- No self-service password reset (no email)

### 2.2 Family Management

#### FR-FAM-001: Family Creation
- Family created automatically on user registration
- Owner can update family name and description
- Owner can toggle public/private setting

#### FR-FAM-002: Family Settings
- isPublic: boolean (controls if family can be discovered)
- Share links managed separately

#### FR-FAM-003: User Management (Owner Only)
- Create new users with specified role
- Assign member profile to user (optional)
- Update user role
- Reset user password
- Delete user

### 2.3 Member Management

#### FR-MEM-001: Create Member
Required fields:
- First name
- Last name

Optional fields:
- Middle name
- Maiden name
- Gender (male/female/other)
- Photo
- Bio
- Occupation
- Education (array)
- Contact info
- Medical history (sensitive)

#### FR-MEM-002: Life Events
Each member can have multiple life events:
| Type | Description |
|------|-------------|
| Birth | Birth event |
| Death | Death event |
| Marriage | Marriage event |
| Work | Employment/career |
| Custom | User-defined type |

Life event fields:
- Type (required)
- Custom type (required if type is "custom")
- Date (partial: year, optional month/day)
- Location (address)
- Notes
- Media references

#### FR-MEM-003: Update Member
- Editor/Owner can update all member fields
- Changes tracked with updatedAt timestamp

#### FR-MEM-004: Delete Member
- Owner/Editor can delete members
- Soft delete not required (hard delete)
- Relationships involving deleted member are also deleted

#### FR-MEM-005: Search Members
- Full-text search across name, bio, occupation
- MongoDB text search implementation
- Fuzzy matching for typos
- Results limited to family members

### 2.4 Relationship Management

#### FR-REL-001: Base Relationship Types
| Type | Description |
|------|-------------|
| PARENT | Parent-child relationship |
| SPOUSE | Marriage/partnership |
| PARTNER | Non-married partnership |
| ADOPTION | Adopted relationship |

#### FR-REL-002: Relationship Fields
- person1 (required)
- person2 (required)
- type (required)
- startDate (optional)
- endDate (optional)
- isCurrent (boolean)
- metadata (adoption details, etc.)

#### FR-REL-003: Calculated Relationships
System automatically calculates derived relationships:
- Grandparent/grandchild
- Sibling (via shared parent)
- Aunt/uncle, niece/nephew
- Cousin (1st, 2nd, removed)
- In-law relationships

#### FR-REL-004: Relationship Rules
- Cannot create duplicate relationships
- Cannot create self-relationship
- Must be in same family

### 2.5 Media Management

#### FR-MED-001: Upload Media
Supported types:
| Type | Formats | Max Size |
|------|---------|----------|
| Photo | JPEG, PNG, WebP, GIF | 10 MB |
| Document | PDF, JPEG, PNG | 25 MB |
| Video | MP4, WebM | 100 MB |

#### FR-MED-002: Media Fields
- Type (required)
- Title (optional)
- Description (optional)
- Tags (array)
- File stored in MinIO

#### FR-MED-003: Media Access
- Authenticated access via presigned URLs
- Share link viewers can access media
- Owner/Editor can delete media

### 2.6 Source Management

#### FR-SRC-001: Source Types
| Type | Description |
|------|-------------|
| Document | Official documents |
| Interview | Oral history |
| Website | Online sources |
| Book | Published sources |

#### FR-SRC-002: Source Fields
- Type (required)
- Title (required)
- URL (optional)
- Media reference (optional)
- Citation (required)
- Reliability (primary/secondary/unverified)

#### FR-SRC-003: Member Sources
- Sources can be linked to specific member fields
- Provides provenance for genealogical data

### 2.7 Timeline Events

#### FR-TIM-001: Timeline Event Fields
- Members involved (array, at least one)
- Event type (custom string)
- Title (required)
- Description (optional)
- Date (partial date)
- Location (optional)
- Media references (array)
- Source references (array)

#### FR-TIM-002: Timeline Display
- Events sorted by date
- Filterable by member
- Can involve multiple members (e.g., wedding)

### 2.8 Tree Visualization

#### FR-VIS-001: View Modes
| Mode | Description |
|------|-------------|
| Chart | Traditional pedigree chart with pan/zoom |
| Graph | Force-directed interactive graph |
| Timeline | Chronological event display |
| List | Collapsible nested hierarchy |

#### FR-VIS-002: Chart Features
- Pan and zoom
- Click member for details
- Expand/collapse generations
- Highlight selected member

#### FR-VIS-003: Graph Features
- Drag nodes
- Zoom and pan
- Click for details
- Relationship lines

### 2.9 Sharing

#### FR-SHR-001: Create Share Link
- Owner can create share links
- Optional password protection
- Optional expiration date
- Unique token generated

#### FR-SHR-002: Access Shared Tree
- Anyone with link can view
- Password required if set
- Expired links denied
- View-only access (no editing)

#### FR-SHR-003: Manage Share Links
- Owner can view all links
- Owner can revoke links
- Links show creation date and expiration

---

## 3. Non-Functional Requirements

### 3.1 Performance

| Requirement | Target |
|-------------|--------|
| Page load time | < 3 seconds |
| API response time | < 500ms (95th percentile) |
| Tree rendering | < 2 seconds for 500 members |
| Search response | < 1 second |

### 3.2 Scalability

| Requirement | Target |
|-------------|--------|
| Members per family | Up to 10,000 |
| Concurrent users | 100 per family |
| File storage | 100 GB per family |

### 3.3 Security

| Requirement | Implementation |
|-------------|----------------|
| Authentication | JWT with HS256 |
| Password hashing | bcrypt (12 rounds) |
| Transport | HTTPS (production) |
| Rate limiting | 100 requests / 15 minutes |
| Input validation | Zod schemas |
| File validation | MIME type + size |

### 3.4 Availability

| Requirement | Target |
|-------------|--------|
| Uptime | 99% |
| Data backup | Daily |
| Backup retention | 30 days |

### 3.5 Compatibility

| Platform | Support |
|----------|---------|
| Browsers | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Screen size | Responsive (mobile, tablet, desktop) |
| Languages | English, Vietnamese |

---

## 4. Data Requirements

### 4.1 Data Retention

| Data Type | Retention |
|-----------|-----------|
| User accounts | Until deleted |
| Family data | Until deleted |
| Media files | Until deleted |
| Backups | 30 days |

### 4.2 Data Privacy

- Medical history is optional and sensitive
- Users can export their data
- Users can delete their data
- Share links provide controlled access

---

## 5. Integration Requirements

### 5.1 External Services

| Service | Purpose |
|---------|---------|
| MinIO | File storage |
| MongoDB | Data storage |

### 5.2 APIs

| API | Purpose |
|-----|---------|
| GraphQL | All application data |
| File upload | Multipart media upload |

---

## 6. Constraint Requirements

### 6.1 Technical Constraints

- Frontend: React + TypeScript
- Backend: Bun.js + TypeScript
- Database: MongoDB
- Deployment: Docker containers
- No external email service
- No OAuth/social login

### 6.2 Business Constraints

- MVP timeline: 5 weeks
- Self-hosted deployment
- No subscription billing (initially)

---

## 7. Acceptance Criteria

### 7.1 MVP Criteria

- [ ] User can register and create family
- [ ] User can login/logout
- [ ] Owner can create family members
- [ ] Owner can add relationships
- [ ] Basic tree visualization works
- [ ] Photos can be uploaded
- [ ] Share links work
- [ ] i18n (EN/VI) functional
- [ ] Test coverage > 80%

### 7.2 Quality Criteria

- [ ] No critical security vulnerabilities
- [ ] Responsive on mobile devices
- [ ] Accessible (WCAG 2.1 AA)
- [ ] API documented
- [ ] Deployment documented

---

## 8. Out of Scope (MVP)

- GEDCOM import/export
- Real-time collaboration
- Mobile native app
- Map integration
- DNA matching
- Subscription billing
- Email notifications
- Advanced search (Elasticsearch)
