# Phase 3: Advanced Customization & User Management

This phase focuses on making JBCert a self-service platform where administrators can manage their own templates and users.

## Proposed Changes

### [Frontend]
#### [NEW] [TemplateManager.jsx](file:///home/szflnx/.gemini/antigravity/scratch/JBCert_v1o1/frontend/src/pages/TemplateManager.jsx)
- Implement a drag-and-drop interface for uploading new certificate images (`.png`/`.jpg`).
- Add a visual mapping tool to click/drag where the student name should appear.
- Save name coordinates (x, y) and font size per template.

#### [NEW] [UserManagement.jsx](file:///home/szflnx/.gemini/antigravity/scratch/JBCert_v1o1/frontend/src/pages/UserManagement.jsx)
- A screen for Super Admins to Create/Update/Delete user accounts.
- View list of all active trainers and their credentials.

### [Backend Node]
#### [MODIFY] [index.ts](file:///home/szflnx/.gemini/antigravity/scratch/JBCert_v1o1/backend-node/src/index.ts)
- Add user CRUD endpoints (RESTful) protected by a new `superAdmin` check.
- Add `/api/templates/upload` endpoint to handle multipart image uploads.
- Store template metadata (coordinates) in a `templates.json` file.

### [Backend Python]
#### [MODIFY] [main.py](file:///home/szflnx/.gemini/antigravity/scratch/JBCert_v1o1/backend-python/main.py)
- Update PDF generation to accept custom (x, y) coordinates for name placement.
- Support dynamic font sizes based on template metadata.

## Super Admin Credentials (Planned)
> [!IMPORTANT]
> The default Super Admin will be configured as:
> - **Username**: `superadmin@jb.com`
> - **Password**: `!!superadmin777`

## Verification Plan
1. **Upload Test**: Verify a new image can be uploaded and appears in the selection list.
2. **Alignment Test**: Generate a certificate using a new template and verify the name appears exactly where mapped.
3. **RBAC Test**: Log in as a regular trainer and verify the "User Management" link is invisible/inaccessible.
