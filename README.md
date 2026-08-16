# UG Find & Return

UNIVERSITY OF GHANA LOST & FOUND SYSTEM

Build a complete, production-quality, mobile-first Lost and Found application for the University of Ghana.

The application allows verified university users to report lost belongings, report found belongings, search for items, receive possible matches, submit ownership claims, provide ownership evidence, communicate through the system, and complete a secure and auditable recovery process.

The core concept is:

REPORT → MATCH → VERIFY → RECOVER

The application's most important differentiating feature is enhanced ownership verification.

This must NOT be a basic CRUD lost-and-found website.

CRITICAL ARCHITECTURE REQUIREMENT

Build the application so that the frontend is completely prepared for Supabase, but DO NOT hard-code the application to a specific Supabase project.

I will later clone/export this project into another development environment called Antigravity and connect it to a completely different Supabase project.

Therefore:

Do not hard-code Supabase project URLs.

Do not hard-code Supabase anon keys.

Do not hard-code Supabase service-role keys.

Do not assume the current Supabase project will be the production project.

Use environment variables.

Keep all database assumptions documented in the code.

Keep all SQL schema/migrations in version-controlled files.

Keep Supabase configuration isolated in a dedicated configuration layer.

Make it possible to connect the same frontend to a new Supabase project by changing environment variables and running the prepared SQL migrations.

Use:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

Never expose a Supabase service-role key in frontend code.

1. TECHNOLOGY STACK

Frontend:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide React icons

Backend integration:

Supabase JavaScript client

Supabase Auth

Supabase PostgreSQL

Supabase Storage

Supabase Row Level Security

However, the current project should primarily focus on:

Complete frontend

Frontend/backend integration structure

Complete SQL preparation

Database documentation

Secure architecture

2. SUPABASE PROJECT INDEPENDENCE

Create a dedicated file such as:

src/lib/supabase.ts

This file should initialize Supabase using environment variables.

Example architecture:

.env.example

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

Do not commit real credentials.

Create:

supabase/
migrations/
seed/
functions/
README.md

All database setup instructions should be documented.

The project must contain an .env.example file.

The README must explain exactly how to connect the application to a new Supabase project.

3. SQL MUST BE PREPARED

Create SQL migration files that contain the complete database setup.

Do not merely describe the database.

Actually prepare the SQL.

The SQL should create:

Extensions where necessary

Profiles table

Categories table

Locations table

Items table

Lost reports

Found reports

Item images

Matches

Claims

Verification questions

Claim responses

Evidence

Messages

Notifications

Handovers

Reports

Audit logs

Also prepare:

Primary keys

Foreign keys

Unique constraints

Check constraints

Indexes

Created-at timestamps

Updated-at timestamps

Useful database functions

Triggers where appropriate

RLS policies

Storage policies

Helper functions for authorization

The SQL must be portable to a fresh Supabase project.

4. DATABASE DOCUMENTATION IN CODE

Every important database table should have comments in the SQL explaining:

What the table is for

What each important field represents

Which fields are public

Which fields are private

Which fields should only be accessed by administrators

Which fields contain sensitive information

How the table relates to other tables

For example:

COMMENT ON TABLE public.claims IS
'Stores ownership claims submitted by users for found items. Claims require verification before handover.';

Do this throughout the schema.

Also create:

supabase/README.md

containing:

Database setup instructions

Migration order

Storage setup

RLS explanation

Authentication setup

Environment variables

Seed data instructions

How to connect a fresh Supabase project

The future developer should be able to understand the entire backend architecture without needing to ask what the tables mean.

5. USER ROLES

Support:

student
admin

A normal student can become a:

Finder

Claimant

Lost-item reporter

These are activities, not separate permanent account roles.

Do NOT create unnecessary roles such as finder_role or claimant_role.

A user is simply a verified student who can perform different actions.

Admin privileges must be enforced server-side/database-side and must not depend solely on frontend state.

6. AUTHENTICATION

Build:

Registration

Login

Logout

Forgot password

Password reset

Email verification

Session persistence

Registration fields:

Full name

Student ID

University email

Phone number

Programme

Level

Hall/Residence

Profile photograph

Password

For now, use Supabase email/password authentication.

Structure the application so future University of Ghana authentication can be integrated.

Do not falsely claim official University of Ghana authentication integration.

7. DESIGN

Create a professional University-oriented design.

Primary colours:

Blue

White

Black

Light gray

The UI should feel:

trustworthy

secure

academic

modern

simple

professional

Avoid excessive animations.

Avoid social-media-style features.

Use:

clean cards

rounded corners

subtle shadows

clear typography

status badges

responsive forms

accessible controls

mobile-first layouts

8. MAIN NAVIGATION

Desktop navigation:

Home

Lost Items

Found Items

Search

Report

Notifications

Profile

Mobile navigation:

Home

Lost

Found

Report

Notifications

Profile

Admin navigation:

Dashboard

Users

Lost Items

Found Items

Claims

Evidence

Reports

Analytics

Categories

Locations

Audit Logs

Settings

9. HOMEPAGE

Create a polished homepage.

Hero:

"Lost something on campus?"

Subtitle:

"Find your belongings or help return items to their rightful owners."

Buttons:

REPORT LOST ITEM

REPORT FOUND ITEM

Large search field:

"Search for an item..."

Sections:

Recently Found

Recently Lost

Possible Recovery Stories

Categories

How It Works

How It Works should show:

Report

Search/Match

Verify Ownership

Recover

10. LOST ITEM PAGE

Create:

/lost

Display lost item cards.

Each card:

Image

Item name

Category

Brand

Colour

General location

Date lost

Status

Reference number

Do not show private identifying information.

Add:

Search

Filters

Pagination

11. FOUND ITEM PAGE

Create:

/found

Display found item cards.

Each card:

Image

Item name

Category

Brand

Colour

General location

Date found

Status

Reference number

Finder should be represented as:

"Verified University User"

Do not publicly expose:

Phone

Email

Student ID

Private finder notes

Private verification details

12. REPORT LOST ITEM

Create a polished multi-step form.

STEP 1:

Item category
Item name
Brand
Model
Colour

STEP 2:

Date lost
Approximate time
Location
Specific area

STEP 3:

Public description

STEP 4:

Private identifying information

Examples:

scratches

cracks

stickers

serial number

IMEI

unique features

accessories

This information must never appear publicly.

STEP 5:

Upload images.

STEP 6:

Review and submit.

Generate reference number:

LF-2026-000001

Do not rely on frontend-only validation.

13. REPORT FOUND ITEM

Create a similar multi-step form.

STEP 1:

Category
Item name
Brand
Model
Colour

STEP 2:

Date found
Time found
Location
Specific area

STEP 3:

Public description

STEP 4:

Private identifying information

STEP 5:

Images

Allow:

Public image

Verification image

STEP 6:

Finder confirmation.

Show:

"I confirm that I found this item and will keep it safely until the item is returned through the platform's recovery process or transferred to an authorized university representative."

14. ITEM DETAILS

Create:

/items/:id

Show:

Image

Item name

Category

Brand

Model

Colour

Public description

General location

Date lost/found

Status

Reference number

Found item:

Show:

"Found by a verified university user."

Never expose private information.

Button:

CLAIM THIS ITEM

15. SEARCH

Global search across:

Item name

Brand

Model

Category

Colour

Location

Reference number

Use debounced search.

Support pagination.

16. FILTERS

Filters:

Category

Location

Date

Status

Brand

Colour

Mobile:

Use filter drawer.

Desktop:

Use sidebar/filter bar.

17. MATCHING ENGINE

Implement frontend support for a matching system.

The backend schema must support:

lost_reports
found_reports
matches

The matching engine should compare:

Category 20%
Brand 15%
Model 15%
Colour 10%
Location 15%
Date 10%
Time 5%
Description 10%

Generate score 0–100.

Interpretation:

80–100 = High confidence
60–79 = Medium confidence
Below 60 = Low confidence

IMPORTANT:

The match score only indicates a possible match.

It must never automatically prove ownership.

18. CLAIM FLOW

When user selects:

CLAIM THIS ITEM

open a claim workflow.

Step 1:

Identity confirmation

Step 2:

Ownership questions

Step 3:

Evidence submission

Step 4:

Declaration

"I confirm that the information I have provided is truthful and that I am the rightful owner or authorized claimant of this item."

Submit.

Status:

claim_submitted

19. OWNERSHIP VERIFICATION

This is the core feature.

Verification questions should be generated from private item information.

Examples:

What unique mark does the item have?

What damage does it have?

What colour is the case?

What accessory was attached?

What was inside the bag?

What is the serial number?

What is the IMEI?

Do NOT show expected answers to the claimant.

Store expected answers securely.

The frontend should only receive questions, never the correct answers.

Comparison should occur securely.

20. CLAIM VERIFICATION SCORE

Calculate:

Identity = 20
Description = 20
Unique feature = 20
Serial/IMEI = 20
Evidence = 10
Report consistency = 10

Total = 100.

Display claimant-facing status such as:

"Your claim is being reviewed."

Do NOT expose sensitive internal verification logic unnecessarily.

Admin can see the detailed score.

21. EVIDENCE

Allow:

Previous photos

Receipts

Serial numbers

IMEI

Warranty

Other proof

Store privately.

Never make evidence public.

Create storage policies.

22. MULTIPLE CLAIMS

If multiple people claim the same item:

Automatically set:

status = disputed

or create an appropriate claim-review state.

Notify administrator.

Admin must resolve the dispute.

Do not allow the finder to decide which claimant gets the item.

23. ADMIN DASHBOARD

Create:

/admin

Statistics:

Total Users

Verified Users

Lost Items

Found Items

Pending Claims

Approved Claims

Rejected Claims

Disputed Claims

Recovered Items

Recovery Rate

Charts:

Lost items by category

Found items by category

Items by location

Monthly reports

Recovery trends

24. ADMIN CLAIM REVIEW

Create:

/admin/claims

Admin should see:

Item

Claimant

Verification score

Verification answers

Evidence

Lost report

Found report

Relevant history

Actions:

APPROVE
REJECT
REQUEST MORE EVIDENCE
MARK DISPUTED

Require review notes.

25. ADMIN USER MANAGEMENT

Create:

/admin/users

Admin can:

Search users

View profile

View verification status

Suspend

Unsuspend

View reports

View claims

View activity

Do not allow normal users to access this page.

26. ADMIN ITEM MANAGEMENT

Create:

/admin/items

Admin can:

Search

Filter

Review

Approve

Reject

Archive

Mark recovered

Mark disputed

27. NOTIFICATIONS

Implement in-app notifications.

Examples:

"Possible match found for your missing item."

"Someone submitted a claim for your found item."

"Your claim is under review."

"Additional evidence is required."

"Your claim has been approved."

"Handover has been scheduled."

"Item successfully recovered."

28. MESSAGING

Implement claim-based messaging.

Messages must belong to a claim.

Do not create unrestricted public messaging.

Users can only communicate when permitted by the claim workflow.

29. HANDOVER

After claim approval:

Create handover.

Fields:

claim

item

owner

finder

location

date

time

verification code

status

Generate secure code.

Example:

UG-LF-82941

30. RECOVERY

At handover:

Finder:

CONFIRM HANDOVER

Owner:

CONFIRM ITEM RECEIVED

Owner enters verification code.

After successful confirmation:

item status = recovered

claim status = completed

handover status = completed

Store timestamp.

Create audit log.

31. AUDIT LOG

Track important actions.

Examples:

User registered

Report created

Report edited

Claim submitted

Evidence uploaded

Admin reviewed claim

Claim approved

Claim rejected

Handover created

Handover completed

Item recovered

User suspended

Dispute resolved

Normal users cannot modify audit logs.

32. DATABASE SCHEMA

Prepare complete SQL migrations for:

profiles
categories
locations
items
lost_reports
found_reports
item_images
matches
claims
verification_questions
claim_responses
evidence
messages
notifications
handovers
reports
audit_logs

Use UUID primary keys.

Use foreign keys.

Use timestamps.

Use indexes for frequently searched fields.

Use appropriate CHECK constraints.

Use unique constraints where necessary.

Use cascading behaviour carefully.

33. PROFILES TABLE

Fields:

id UUID
student_id TEXT UNIQUE
full_name TEXT
email TEXT
phone TEXT
profile_photo_url TEXT
programme TEXT
level TEXT
hall TEXT
role TEXT
verification_status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ

Role must never be editable by the normal user.

34. ITEMS TABLE

Fields:

id UUID
reference_number TEXT UNIQUE
category_id UUID
item_name TEXT
brand TEXT
model TEXT
colour TEXT
public_description TEXT
status TEXT
created_by UUID
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ

35. LOST REPORTS

Fields:

id UUID
item_id UUID
owner_id UUID
date_lost DATE
approximate_time TEXT
location_id UUID
specific_area TEXT
private_identifying_details TEXT
created_at TIMESTAMPTZ

36. FOUND REPORTS

Fields:

id UUID
item_id UUID
finder_id UUID
date_found DATE
time_found TIME
location_id UUID
specific_area TEXT
private_identifying_details TEXT
finder_notes TEXT
created_at TIMESTAMPTZ

37. MATCHES

Fields:

id UUID
lost_report_id UUID
found_report_id UUID
match_score NUMERIC
status TEXT
created_at TIMESTAMPTZ

38. CLAIMS

Fields:

id UUID
item_id UUID
claimant_id UUID
status TEXT
verification_score NUMERIC
submitted_at TIMESTAMPTZ
reviewed_at TIMESTAMPTZ
reviewed_by UUID
review_notes TEXT

39. VERIFICATION QUESTIONS

Fields:

id UUID
item_id UUID
question TEXT
expected_answer TEXT
question_type TEXT
created_at TIMESTAMPTZ

CRITICAL:

Never expose expected_answer through normal client queries.

Use RLS or secure database functions so only authorized administrators/backend processes can access expected answers.

40. CLAIM RESPONSES

Fields:

id UUID
claim_id UUID
question_id UUID
response TEXT
score NUMERIC
created_at TIMESTAMPTZ

41. EVIDENCE

Fields:

id UUID
claim_id UUID
submitted_by UUID
type TEXT
description TEXT
storage_path TEXT
status TEXT
reviewed_by UUID
review_notes TEXT
created_at TIMESTAMPTZ

Evidence is private.

42. MESSAGES

Fields:

id UUID
claim_id UUID
sender_id UUID
receiver_id UUID
message TEXT
read_at TIMESTAMPTZ
created_at TIMESTAMPTZ

43. NOTIFICATIONS

Fields:

id UUID
user_id UUID
type TEXT
title TEXT
message TEXT
read_at TIMESTAMPTZ
created_at TIMESTAMPTZ

44. HANDOVERS

Fields:

id UUID
claim_id UUID
location_id UUID
scheduled_date DATE
scheduled_time TIME
verification_code TEXT
finder_confirmed BOOLEAN
owner_confirmed BOOLEAN
status TEXT
completed_at TIMESTAMPTZ
created_at TIMESTAMPTZ

45. REPORTS

Fields:

id UUID
reporter_id UUID
item_id UUID
claim_id UUID
reason TEXT
description TEXT
status TEXT
reviewed_by UUID
created_at TIMESTAMPTZ

46. AUDIT LOGS

Fields:

id UUID
user_id UUID
action TEXT
entity_type TEXT
entity_id UUID
metadata JSONB
created_at TIMESTAMPTZ

47. RLS

Prepare complete RLS policies.

Normal users:

Can view public item information.

Can create their own reports.

Can update their own reports according to status.

Can view their own claims.

Can create claims.

Can submit evidence for their own claims.

Can view messages belonging to their claims.

Can view their own notifications.

Can update their own profile except role/verification status.

Users cannot:

Read private evidence belonging to other users.

Read private identifying details unless authorized.

Read expected verification answers.

Modify other users' claims.

Modify audit logs.

Access admin data.

Change their role.

Admins have appropriate access.

48. STORAGE

Prepare Supabase storage configuration/documentation.

Buckets:

public-item-images
profile-images
private-evidence

Private evidence must require authorization.

Do not expose service-role credentials.

49. SQL FILE STRUCTURE

Create:

supabase/
migrations/
001_extensions.sql
002_profiles.sql
003_categories.sql
004_locations.sql
005_items.sql
006_lost_reports.sql
007_found_reports.sql
008_item_images.sql
009_matches.sql
010_claims.sql
011_verification.sql
012_evidence.sql
013_messages.sql
014_notifications.sql
015_handovers.sql
016_reports.sql
017_audit_logs.sql
018_functions.sql
019_triggers.sql
020_rls.sql
021_storage.sql
022_indexes.sql

The exact number/order can be adjusted if a better migration structure is required.

50. SEED DATA

Create:

supabase/seed/seed.sql

Include fictional demo data.

Do not use real University of Ghana student information.

Include:

Demo student

Demo admin

Demo finder

Demo items

Demo claims

Demo locations

Demo categories

Clearly mark demo data.

51. README

Create a detailed README explaining:

Project

University of Ghana Lost & Found

Requirements

Node.js
npm
Supabase account

Environment variables

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

Local setup

npm install

npm run dev

New Supabase setup

Create a new Supabase project.

Copy project URL.

Copy anon/publishable key.

Add them to .env.local.

Run migration SQL in order.

Configure storage.

Run seed data if required.

Start frontend.

Migration instructions

Explain how every migration should be executed.

Security

Explain RLS.

Storage

Explain buckets and policies.

Authentication

Explain authentication setup.

Architecture

Explain how frontend, Supabase Auth, PostgreSQL and Storage communicate.

52. ENVIRONMENT FILE

Create:

.env.example

Containing:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

Do NOT create a real .env containing credentials.

53. FRONTEND API LAYER

Do not scatter Supabase calls throughout every component.

Create a service/data layer.

Example:

src/
lib/
supabase.ts

services/
authService.ts
itemService.ts
claimService.ts
evidenceService.ts
notificationService.ts
messageService.ts
handoverService.ts
adminService.ts

Components should call service functions rather than directly embedding complex database queries everywhere.

This will make the project easier to migrate to Antigravity and another Supabase project.

54. TYPES

Create TypeScript types corresponding to the database.

Prefer generated Supabase types where possible.

Keep database types centralized.

Example:

src/types/database.ts

or an appropriate generated Supabase type file.

55. ERROR HANDLING

Do not expose raw Supabase/database errors.

Show friendly messages.

Log useful development information.

Examples:

"Unable to submit your report. Please try again."

"Your claim could not be submitted."

"Your evidence upload failed."

"Your session has expired."

56. LOADING STATES

Use:

Skeletons

Spinners

Upload progress

Disabled buttons during submission

Empty states

Do not allow duplicate form submissions.

57. RESPONSIVE DESIGN

Test:

375px
390px
430px
768px
1024px
1440px

Mobile experience is a priority.

Forms should be easy to complete using a phone.

Support image uploads from mobile camera/gallery.

58. ACCESSIBILITY

Implement:

labels

keyboard navigation

focus states

semantic HTML

accessible buttons

alt text

appropriate contrast

59. SECURITY REVIEW

Before considering the frontend complete, check for:

Exposed secrets

Service-role keys

Unauthorized admin routes

Insecure queries

Missing RLS

Public private evidence

Exposed verification answers

Role manipulation

Client-side-only authorization

Unsafe file uploads

XSS

SQL injection risks

60. IMPORTANT: DO NOT FAKE BACKEND FEATURES

If a feature requires backend functionality that has not yet been connected, do not pretend it is fully functional.

Use a clearly documented service interface/mock state only where necessary.

The UI should still be complete and ready for Supabase integration.

Do not create fake permanent data in localStorage as a replacement for the database.

61. FRONTEND ACCEPTANCE CRITERIA

The frontend must include:

Complete responsive navigation

Authentication screens

Registration

Login

Homepage

Lost items

Found items

Search

Filtering

Item details

Report lost

Report found

Claim flow

Verification flow

Evidence upload interface

Notifications

Messaging

Handover

User profile

User dashboard

Admin dashboard

Admin claims

Admin users

Admin items

Admin reports

Admin analytics

Admin audit logs

62. DATABASE ACCEPTANCE CRITERIA

The SQL must provide:

Complete schema

Foreign keys

Indexes

Constraints

RLS

Storage policies

Authorization functions

Useful triggers

Audit support

Seed data

Documentation

A completely fresh Supabase project should be able to reproduce the intended backend by following the README and executing the prepared SQL migrations.

63. MIGRATION TO ANTIGRAVITY

The project must be structured so that I can:

Clone/export the project.

Open it in Antigravity.

Create a completely new Supabase project.

Copy the new Supabase URL and anon key into .env.local.

Run the SQL migrations.

Configure storage.

Run the frontend.

Continue development without rewriting the application.

Document this workflow clearly in the README.

64. FINAL DEVELOPMENT PRIORITY

Prioritize in this order:

Architecture

Database schema

Security/RLS preparation

Authentication UI

Core frontend

Lost/found workflows

Claims

Ownership verification

Admin system

Handover

Notifications

Analytics

Visual polish

Do not prioritize animations or decorative features over functionality and security.

65. FINAL PRODUCT PRINCIPLE

The application must be built around:

REPORT → MATCH → VERIFY → RECOVER

The central research/technical problem is not merely helping students post lost items.

The central problem is:

How can a university lost-and-found platform help identify potential matches while reducing fraudulent ownership claims and providing a secure, auditable recovery process?

Build the frontend and SQL architecture around solving that problem.

Do not produce a superficial lost-and-found marketplace.

Build a serious university information system that can later be connected to a fresh Supabase project and continued in Antigravity.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/15d76851-6d58-49f0-9661-a44bdd4d8a65).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
