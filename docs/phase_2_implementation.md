# UI/UX Overhaul & Feature Refinement

This plan focuses on transforming the JBCert frontend into a premium, modern web application and simplifying the user experience by removing unnecessary fields.

## Proposed Changes

### [Frontend]
#### [MODIFY] [index.css](file:///home/szflnx/.gemini/antigravity/scratch/JBCert_v1o1/frontend/src/index.css)
- Implement a modern design system with CSS variables (colors, spacing, shadows).
- Use Inter or Outfit fonts from Google Fonts.
- Add micro-animations for buttons and inputs.
- Implement a sleek background (gradient or mesh).

### [Backend Node Security]
#### [MODIFY] [index.ts](file:///home/szflnx/.gemini/antigravity/scratch/JBCert_v1o1/backend-node/src/index.ts)
- Implement `authenticateToken` middleware to verify JWTs in the `Authorization` header.
- Protect `/api/templates`, `/generate-certificate`, and `/generate-bulk` routes using the middleware.
- Refactor route structure to group protected routes if necessary.

### [Backend Python]
#### [MODIFY] [main.py](file:///home/szflnx/.gemini/antigravity/scratch/JBCert_v1o1/backend-python/main.py)
- Make `course_name` optional in the API to avoid errors when the frontend stops sending it.
- Clean up commented-out code.

## Verification Plan

### Manual Verification
1. **Frontend Visual Check**: Ensure the new design looks premium and is responsive.
2. **Form Submission**: Test generating a certificate with just the student name.
3. **Download**: Verify the PDF still downloads correctly with the proper name.
