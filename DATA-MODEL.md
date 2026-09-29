# Database Schema & Data Model

The platform is backed by PostgreSQL, running entirely offline. 
We use SQLAlchemy ORM to enforce relationships and maintain data integrity.

## Core Models

### 1. User (`users`)
*   **id:** UUID (Primary Key)
*   **email:** String (Unique)
*   **password_hash:** String (Bcrypt encrypted)
*   **role:** Enum (`ADMIN`, `ORGANIZER`, `JUDGE`, `PARTICIPANT`) - Enforced at the database level.
*   **team_id:** UUID (Foreign Key to `teams`)

### 2. Team (`teams`)
*   **id:** UUID (Primary Key)
*   **name:** String
*   **invite_code:** String (Unique, used for team formation)

### 3. Project Submission (`submissions`)
*   **id:** UUID (Primary Key)
*   **team_id:** UUID (Foreign Key)
*   **title / description / repo_url:** Strings
*   **is_draft:** Boolean (Determines if the project is ready for judging)

### 4. Judge Assignment (`judge_assignments`)
*   **id:** UUID (Primary Key)
*   **judge_id:** UUID (Foreign Key to `users`)
*   **submission_id:** UUID (Foreign Key to `submissions`)
*   **criteria_scores:** JSON (Dynamic rubric storage allowing flexible hackathon rules)
*   **normalized_score:** Integer (The final Z-Score adjusted metric)
*   **is_submitted:** Boolean
