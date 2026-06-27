const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  LevelFormat, ShadingType, VerticalAlign, PageNumber, PageBreak
} = require("docx");

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
const headerShading = { fill: "1B4F72", type: ShadingType.CLEAR };
const altRowShading = { fill: "EBF5FB", type: ShadingType.CLEAR };

function hCell(text, width) {
  return new TableCell({
    borders: cellBorders, width: { size: width, type: WidthType.DXA },
    shading: headerShading, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Arial", size: 20 })] })]
  });
}

function dCell(text, width, shading) {
  const opts = { borders: cellBorders, width: { size: width, type: WidthType.DXA },
    children: [new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 20 })] })] };
  if (shading) opts.shading = shading;
  return new TableCell(opts);
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 52, bold: true, color: "1B4F72", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "1B4F72", font: "Arial" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "2E86C1", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: "34495E", font: "Arial" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-features", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-workflow", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-phases", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-admin", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-officer", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-owner", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-security", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-calc", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-bill-status", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-frontend", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-backend", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-db", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // ==================== COVER PAGE ====================
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        new Paragraph({ spacing: { before: 3000 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "Design and Implementation of a", size: 28, color: "555555", font: "Arial" })]
        }),
        new Paragraph({
          heading: HeadingLevel.TITLE,
          children: [new TextRun({ text: "Web-Based House Property Tax", size: 52, bold: true, color: "1B4F72" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 400 },
          children: [new TextRun({ text: "Management System", size: 52, bold: true, color: "1B4F72", font: "Arial" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "________________________________________", size: 24, color: "2E86C1" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "System Documentation & Technical Report", size: 24, color: "555555", font: "Arial" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 600, after: 100 },
          children: [new TextRun({ text: "Final Year Project", size: 26, bold: true, color: "1B4F72", font: "Arial" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Academic Year: 2025 / 2026", size: 22, color: "555555", font: "Arial" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 800 },
          children: [new TextRun({ text: "Date: June 2026", size: 22, color: "555555", font: "Arial" })]
        }),
      ]
    },
    // ==================== MAIN CONTENT ====================
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "House Property Tax Management System", italics: true, size: 18, color: "888888", font: "Arial" })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Page ", size: 18, font: "Arial" }), new TextRun({ children: [PageNumber.CURRENT], size: 18 }), new TextRun({ text: " of ", size: 18, font: "Arial" }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18 })]
          })]
        })
      },
      children: [
        // ===== 1. INTRODUCTION =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Introduction")] }),
        new Paragraph({ spacing: { after: 200 }, children: [
          new TextRun({ text: "The House Property Tax Management System is a full-stack web application designed to digitize and streamline the entire lifecycle of house property tax management. The system replaces manual, paper-based processes with an efficient digital workflow that covers property registration, tax assessment, billing, payment recording, receipt generation, and comprehensive reporting." })
        ]}),
        new Paragraph({ spacing: { after: 200 }, children: [
          new TextRun({ text: "This project addresses the real-world challenges faced by municipal tax authorities in managing property taxes, including data inconsistency, delayed billing, lack of audit trails, and limited transparency for property owners." })
        ]}),

        // ===== 1.1 Problem Statement =====
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 Problem Statement")] }),
        new Paragraph({ spacing: { after: 200 }, children: [
          new TextRun({ text: "Traditional property tax management relies on manual record-keeping that is prone to errors, data loss, and inefficiency. Property owners lack visibility into their tax obligations, and tax authorities struggle with collection tracking and reporting. There is a need for an automated, role-based system that provides transparency, accuracy, and accountability throughout the property tax lifecycle." })
        ]}),

        // ===== 1.2 Project Objectives =====
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 Project Objectives")] }),
        new Paragraph({ numbering: { reference: "num-features", level: 0 }, children: [new TextRun("Develop a web-based system with role-based access control for Admin, Tax Officer, and Property Owner users.")] }),
        new Paragraph({ numbering: { reference: "num-features", level: 0 }, children: [new TextRun("Implement property registration and owner management with complete CRUD operations.")] }),
        new Paragraph({ numbering: { reference: "num-features", level: 0 }, children: [new TextRun("Automate tax assessment and bill generation based on configurable tax rates per zone and property type.")] }),
        new Paragraph({ numbering: { reference: "num-features", level: 0 }, children: [new TextRun("Enable payment recording with support for full and partial payments, and automatic balance tracking.")] }),
        new Paragraph({ numbering: { reference: "num-features", level: 0 }, children: [new TextRun("Generate downloadable PDF receipts for recorded payments.")] }),
        new Paragraph({ numbering: { reference: "num-features", level: 0 }, children: [new TextRun("Provide a self-service portal for property owners to view their properties, bills, payments, and receipts.")] }),
        new Paragraph({ numbering: { reference: "num-features", level: 0 }, children: [new TextRun("Deliver comprehensive reporting dashboards with filtering by period, zone, tax year, property type, and payment status.")] }),
        new Paragraph({ numbering: { reference: "num-features", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Maintain a complete audit log of all significant system actions for accountability.")] }),

        // ===== 2. SYSTEM ARCHITECTURE =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. System Architecture")] }),
        new Paragraph({ spacing: { after: 200 }, children: [
          new TextRun({ text: "The system follows a modern three-tier architecture with a clear separation between the frontend (presentation layer), backend (business logic layer), and database (data layer). Communication between the frontend and backend is done through RESTful API endpoints secured with JWT authentication." })
        ]}),

        // ===== 2.1 Technology Stack =====
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Technology Stack")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Frontend Technologies")] }),
        new Paragraph({ numbering: { reference: "bullet-frontend", level: 0 }, children: [new TextRun({ text: "React.js with Vite", bold: true }), new TextRun(" \u2014 Fast, modern JavaScript framework for building the user interface with hot module replacement during development.")] }),
        new Paragraph({ numbering: { reference: "bullet-frontend", level: 0 }, children: [new TextRun({ text: "Tailwind CSS", bold: true }), new TextRun(" \u2014 Utility-first CSS framework for responsive and consistent styling across all pages.")] }),
        new Paragraph({ numbering: { reference: "bullet-frontend", level: 0 }, children: [new TextRun({ text: "React Router v6", bold: true }), new TextRun(" \u2014 Client-side routing with role-based route protection.")] }),
        new Paragraph({ numbering: { reference: "bullet-frontend", level: 0 }, spacing: { after: 100 }, children: [new TextRun({ text: "Axios", bold: true }), new TextRun(" \u2014 HTTP client for API communication with automatic token attachment.")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Backend Technologies")] }),
        new Paragraph({ numbering: { reference: "bullet-backend", level: 0 }, children: [new TextRun({ text: "Node.js with Express.js", bold: true }), new TextRun(" \u2014 Server-side JavaScript runtime and web framework for building the REST API.")] }),
        new Paragraph({ numbering: { reference: "bullet-backend", level: 0 }, children: [new TextRun({ text: "JWT (JSON Web Tokens)", bold: true }), new TextRun(" \u2014 Stateless authentication mechanism for secure API access.")] }),
        new Paragraph({ numbering: { reference: "bullet-backend", level: 0 }, children: [new TextRun({ text: "bcrypt", bold: true }), new TextRun(" \u2014 Password hashing library for secure credential storage.")] }),
        new Paragraph({ numbering: { reference: "bullet-backend", level: 0 }, children: [new TextRun({ text: "PDFKit", bold: true }), new TextRun(" \u2014 PDF generation library for creating downloadable receipts and bills.")] }),
        new Paragraph({ numbering: { reference: "bullet-backend", level: 0 }, spacing: { after: 100 }, children: [new TextRun({ text: "express-validator", bold: true }), new TextRun(" \u2014 Input validation and sanitization middleware.")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Database")] }),
        new Paragraph({ numbering: { reference: "bullet-db", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "MongoDB Atlas with Mongoose", bold: true }), new TextRun(" \u2014 Cloud-hosted NoSQL database with an ODM (Object Data Modeling) layer for schema definition, validation, and relationship management.")] }),

        // ===== 2.2 Project Structure =====
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Project Structure")] }),
        new Table({
          columnWidths: [3000, 6360],
          rows: [
            new TableRow({ tableHeader: true, children: [hCell("Directory", 3000), hCell("Description", 6360)] }),
            new TableRow({ children: [dCell("client/", 3000), dCell("React + Vite frontend application", 6360)] }),
            new TableRow({ children: [dCell("  src/features/", 3000, altRowShading), dCell("Feature modules: auth, dashboard, users, owners, properties, taxRates, assessments, bills, payments, receipts, reports, auditLogs", 6360, altRowShading)] }),
            new TableRow({ children: [dCell("  src/layouts/", 3000), dCell("Shared dashboard layout with sidebar navigation", 6360)] }),
            new TableRow({ children: [dCell("  src/services/", 3000, altRowShading), dCell("API service layer (Axios instances)", 6360, altRowShading)] }),
            new TableRow({ children: [dCell("  src/routes/", 3000), dCell("Route definitions with role-based guards", 6360)] }),
            new TableRow({ children: [dCell("server/", 3000, altRowShading), dCell("Node.js + Express API server", 6360, altRowShading)] }),
            new TableRow({ children: [dCell("  src/models/", 3000), dCell("Mongoose schema definitions (9 models)", 6360)] }),
            new TableRow({ children: [dCell("  src/controllers/", 3000, altRowShading), dCell("Request handlers and business logic", 6360, altRowShading)] }),
            new TableRow({ children: [dCell("  src/routes/", 3000), dCell("API route definitions (13 route files)", 6360)] }),
            new TableRow({ children: [dCell("  src/middleware/", 3000, altRowShading), dCell("Authentication and authorization middleware", 6360, altRowShading)] }),
            new TableRow({ children: [dCell("  src/services/", 3000), dCell("Tax calculation and business services", 6360)] }),
            new TableRow({ children: [dCell("  src/seeds/", 3000, altRowShading), dCell("Database seed script with demo data", 6360, altRowShading)] }),
            new TableRow({ children: [dCell("docs/", 3000), dCell("API documentation, testing checklist, screenshots", 6360)] }),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== 3. USER ROLES & ACCESS CONTROL =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. User Roles and Access Control")] }),
        new Paragraph({ spacing: { after: 200 }, children: [
          new TextRun({ text: "The system implements a role-based access control (RBAC) model with three distinct user roles. Each role has specific permissions that determine which features, pages, and API endpoints the user can access." })
        ]}),

        // 3.1 Admin
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Admin Role")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "The Admin is the system super-user with full access to all management features. Admin responsibilities include:" })] }),
        new Paragraph({ numbering: { reference: "bullet-admin", level: 0 }, children: [new TextRun("Manage user accounts (create, update, deactivate officers and owners)")] }),
        new Paragraph({ numbering: { reference: "bullet-admin", level: 0 }, children: [new TextRun("Configure zones and property types for the tax structure")] }),
        new Paragraph({ numbering: { reference: "bullet-admin", level: 0 }, children: [new TextRun("Create, edit, and delete tax rates per zone, property type, and tax year")] }),
        new Paragraph({ numbering: { reference: "bullet-admin", level: 0 }, children: [new TextRun("View all owners, properties, bills, payments, and receipts system-wide")] }),
        new Paragraph({ numbering: { reference: "bullet-admin", level: 0 }, children: [new TextRun("Access comprehensive reports: summary, collections, outstanding, and zone-based breakdowns")] }),
        new Paragraph({ numbering: { reference: "bullet-admin", level: 0 }, spacing: { after: 200 }, children: [new TextRun("View audit logs that track all significant system actions")] }),

        // 3.2 Tax Officer
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Tax Officer Role")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "The Tax Officer handles day-to-day operational tasks in the tax workflow:" })] }),
        new Paragraph({ numbering: { reference: "bullet-officer", level: 0 }, children: [new TextRun("Register new property owners with personal details and contact information")] }),
        new Paragraph({ numbering: { reference: "bullet-officer", level: 0 }, children: [new TextRun("Register and update properties with zone, type, size, assessed value, and usage status")] }),
        new Paragraph({ numbering: { reference: "bullet-officer", level: 0 }, children: [new TextRun("Generate tax assessments for properties based on the applicable tax rate")] }),
        new Paragraph({ numbering: { reference: "bullet-officer", level: 0 }, children: [new TextRun("Create bills from assessments with specified due dates")] }),
        new Paragraph({ numbering: { reference: "bullet-officer", level: 0 }, children: [new TextRun("Record full or partial payments against outstanding bills")] }),
        new Paragraph({ numbering: { reference: "bullet-officer", level: 0 }, children: [new TextRun("Generate and download payment receipts as PDF documents")] }),
        new Paragraph({ numbering: { reference: "bullet-officer", level: 0 }, spacing: { after: 200 }, children: [new TextRun("View operational reports filtered by period, zone, and property type")] }),

        // 3.3 Property Owner
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Property Owner Role")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Property Owners have a self-service portal with read-only access to their own data:" })] }),
        new Paragraph({ numbering: { reference: "bullet-owner", level: 0 }, children: [new TextRun("View their own registered properties and details")] }),
        new Paragraph({ numbering: { reference: "bullet-owner", level: 0 }, children: [new TextRun("View bills and outstanding balances for their properties only")] }),
        new Paragraph({ numbering: { reference: "bullet-owner", level: 0 }, children: [new TextRun("View complete payment history for their bills")] }),
        new Paragraph({ numbering: { reference: "bullet-owner", level: 0 }, children: [new TextRun("Download PDF receipts for their payments")] }),
        new Paragraph({ numbering: { reference: "bullet-owner", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Owners cannot access admin or officer routes \u2014 enforced at both API and frontend levels")] }),

        // Demo Accounts Table
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.4 Demo Accounts")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("The following accounts are created by the seed script for demonstration:")] }),
        new Table({
          columnWidths: [2000, 3200, 2160, 2000],
          rows: [
            new TableRow({ tableHeader: true, children: [hCell("Role", 2000), hCell("Email", 3200), hCell("Password", 2160), hCell("Name", 2000)] }),
            new TableRow({ children: [dCell("Admin", 2000), dCell("admin@example.com", 3200), dCell("Admin@12345", 2160), dCell("System Admin", 2000)] }),
            new TableRow({ children: [dCell("Officer", 2000, altRowShading), dCell("officer@example.com", 3200, altRowShading), dCell("Officer@12345", 2160, altRowShading), dCell("Tax Officer", 2000, altRowShading)] }),
            new TableRow({ children: [dCell("Owner", 2000), dCell("owner@example.com", 3200), dCell("Owner@12345", 2160), dCell("Property Owner", 2000)] }),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== 4. DATABASE DESIGN =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Database Design")] }),
        new Paragraph({ spacing: { after: 200 }, children: [
          new TextRun({ text: "The system uses MongoDB as its database with Mongoose ODM for schema definition and validation. The database consists of 9 collections (models), each with timestamps and proper validation rules. Below is a summary of each model and its key fields." })
        ]}),

        // User Model
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 User Model")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Stores system user accounts for authentication and authorization.")] }),
        new Table({
          columnWidths: [2200, 2200, 4960],
          rows: [
            new TableRow({ tableHeader: true, children: [hCell("Field", 2200), hCell("Type", 2200), hCell("Description", 4960)] }),
            new TableRow({ children: [dCell("name", 2200), dCell("String", 2200), dCell("User's full name (required)", 4960)] }),
            new TableRow({ children: [dCell("email", 2200, altRowShading), dCell("String", 2200, altRowShading), dCell("Unique email address for login (required)", 4960, altRowShading)] }),
            new TableRow({ children: [dCell("passwordHash", 2200), dCell("String", 2200), dCell("Bcrypt hashed password (hidden from API responses)", 4960)] }),
            new TableRow({ children: [dCell("role", 2200, altRowShading), dCell("Enum", 2200, altRowShading), dCell("admin | officer | owner", 4960, altRowShading)] }),
            new TableRow({ children: [dCell("status", 2200), dCell("Enum", 2200), dCell("active | inactive (default: active)", 4960)] }),
          ]
        }),

        // Owner Model
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Owner Model")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Stores property owner personal information, optionally linked to a User account.")] }),
        new Table({
          columnWidths: [2200, 2200, 4960],
          rows: [
            new TableRow({ tableHeader: true, children: [hCell("Field", 2200), hCell("Type", 2200), hCell("Description", 4960)] }),
            new TableRow({ children: [dCell("userId", 2200), dCell("ObjectId (ref User)", 2200), dCell("Optional link to a User account for portal login", 4960)] }),
            new TableRow({ children: [dCell("fullName", 2200, altRowShading), dCell("String", 2200, altRowShading), dCell("Owner's full name (required)", 4960, altRowShading)] }),
            new TableRow({ children: [dCell("phone", 2200), dCell("String", 2200), dCell("Contact phone number (required)", 4960)] }),
            new TableRow({ children: [dCell("email", 2200, altRowShading), dCell("String", 2200, altRowShading), dCell("Contact email (optional)", 4960, altRowShading)] }),
            new TableRow({ children: [dCell("nationalId", 2200), dCell("String", 2200), dCell("National ID (unique, sparse index)", 4960)] }),
            new TableRow({ children: [dCell("address", 2200, altRowShading), dCell("String", 2200, altRowShading), dCell("Residential address (required)", 4960, altRowShading)] }),
          ]
        }),

        // Property Model
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Property Model")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Stores registered properties with their location, classification, and assessed value.")] }),
        new Table({
          columnWidths: [2200, 2200, 4960],
          rows: [
            new TableRow({ tableHeader: true, children: [hCell("Field", 2200), hCell("Type", 2200), hCell("Description", 4960)] }),
            new TableRow({ children: [dCell("ownerId", 2200), dCell("ObjectId (ref Owner)", 2200), dCell("Reference to the property owner (required)", 4960)] }),
            new TableRow({ children: [dCell("propertyCode", 2200, altRowShading), dCell("String", 2200, altRowShading), dCell("Unique property identifier code (auto-uppercase)", 4960, altRowShading)] }),
            new TableRow({ children: [dCell("district", 2200), dCell("String", 2200), dCell("District location (required)", 4960)] }),
            new TableRow({ children: [dCell("zone", 2200, altRowShading), dCell("String", 2200, altRowShading), dCell("Tax zone (e.g., Zone A, Zone B, Zone C)", 4960, altRowShading)] }),
            new TableRow({ children: [dCell("propertyType", 2200), dCell("String", 2200), dCell("Residential | Commercial | Industrial", 4960)] }),
            new TableRow({ children: [dCell("sizeSqm", 2200, altRowShading), dCell("Number", 2200, altRowShading), dCell("Property size in square meters (optional)", 4960, altRowShading)] }),
            new TableRow({ children: [dCell("assessedValue", 2200), dCell("Number", 2200), dCell("Property value for tax calculation (required)", 4960)] }),
            new TableRow({ children: [dCell("usageStatus", 2200, altRowShading), dCell("Enum", 2200, altRowShading), dCell("occupied | vacant | rented", 4960, altRowShading)] }),
            new TableRow({ children: [dCell("status", 2200), dCell("Enum", 2200), dCell("active | inactive", 4960)] }),
          ]
        }),

        // TaxRate Model
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.4 TaxRate Model")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Defines tax rates per zone, property type, and tax year. Unique compound index on (zone + propertyType + taxYear).")] }),
        new Table({
          columnWidths: [2200, 2200, 4960],
          rows: [
            new TableRow({ tableHeader: true, children: [hCell("Field", 2200), hCell("Type", 2200), hCell("Description", 4960)] }),
            new TableRow({ children: [dCell("zone", 2200), dCell("String", 2200), dCell("Tax zone (required)", 4960)] }),
            new TableRow({ children: [dCell("propertyType", 2200, altRowShading), dCell("String", 2200, altRowShading), dCell("Property type (required)", 4960, altRowShading)] }),
            new TableRow({ children: [dCell("taxYear", 2200), dCell("Number", 2200), dCell("Tax year (required, min: 2000)", 4960)] }),
            new TableRow({ children: [dCell("rateType", 2200, altRowShading), dCell("Enum", 2200, altRowShading), dCell("fixed | percentage", 4960, altRowShading)] }),
            new TableRow({ children: [dCell("rateValue", 2200), dCell("Number", 2200), dCell("Rate value (fixed amount or percentage)", 4960)] }),
            new TableRow({ children: [dCell("createdBy", 2200, altRowShading), dCell("ObjectId (ref User)", 2200, altRowShading), dCell("Admin who created this rate", 4960, altRowShading)] }),
          ]
        }),

        // Assessment, Bill, Payment, Receipt, AuditLog
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.5 Assessment Model")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Generated from a property and its matching tax rate. Unique compound index on (propertyId + taxYear). Fields: propertyId, taxYear, baseTax, penalty (default 0), discount (default 0), totalDue, assessedBy (ref User).")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.6 Bill Model")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Created from an assessment with a due date. Fields: assessmentId, billNo (unique), dueDate, amountDue, amountPaid (default 0), balance, status (unpaid | partial | paid | overdue | cancelled), issuedBy (ref User).")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.7 Payment Model")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Records payments against bills. Fields: billId, amountPaid, method (cash | bank | mobile_money | other), referenceNo (unique sparse), paymentDate, recordedBy (ref User).")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.8 Receipt Model")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Auto-generated when a payment is recorded. Fields: paymentId (unique ref Payment), receiptNo (unique), pdfPath (optional), qrToken (optional for verification).")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.9 AuditLog Model")] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Records significant system actions for accountability. Fields: actorId (ref User), action, entityType, entityId, description, ipAddress. Indexed on createdAt and (entityType + entityId).")] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== 5. TAX CALCULATION LOGIC =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Tax Calculation Logic")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("The system uses a straightforward tax calculation model based on the property's zone, type, and the applicable tax rate:")] }),

        new Paragraph({ numbering: { reference: "bullet-calc", level: 0 }, children: [new TextRun({ text: "Fixed rate: ", bold: true }), new TextRun("Annual tax = rateValue (a flat dollar amount regardless of property value)")] }),
        new Paragraph({ numbering: { reference: "bullet-calc", level: 0 }, children: [new TextRun({ text: "Percentage rate: ", bold: true }), new TextRun("Annual tax = assessedValue \u00D7 rateValue / 100")] }),
        new Paragraph({ numbering: { reference: "bullet-calc", level: 0 }, children: [new TextRun({ text: "Total Due: ", bold: true }), new TextRun("totalDue = baseTax + penalty \u2212 discount")] }),
        new Paragraph({ numbering: { reference: "bullet-calc", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Bill Balance: ", bold: true }), new TextRun("balance = amountDue \u2212 amountPaid")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Bill Status Rules")] }),
        new Paragraph({ numbering: { reference: "num-bill-status", level: 0 }, children: [new TextRun({ text: "Paid", bold: true }), new TextRun(" \u2014 balance \u2264 0 (fully settled)")] }),
        new Paragraph({ numbering: { reference: "num-bill-status", level: 0 }, children: [new TextRun({ text: "Partial", bold: true }), new TextRun(" \u2014 amountPaid > 0 and balance > 0 (before due date)")] }),
        new Paragraph({ numbering: { reference: "num-bill-status", level: 0 }, children: [new TextRun({ text: "Unpaid", bold: true }), new TextRun(" \u2014 amountPaid = 0 and due date not yet passed")] }),
        new Paragraph({ numbering: { reference: "num-bill-status", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Overdue", bold: true }), new TextRun(" \u2014 due date passed and balance > 0")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 Example Tax Calculations (Seeded Data)")] }),
        new Table({
          columnWidths: [2800, 1800, 1600, 1600, 1560],
          rows: [
            new TableRow({ tableHeader: true, children: [hCell("Property", 2800), hCell("Zone / Type", 1800), hCell("Rate", 1600), hCell("Assessed Value", 1600), hCell("Tax Due", 1560)] }),
            new TableRow({ children: [dCell("PROP-SEED-001", 2800), dCell("Zone A / Residential", 1800), dCell("1.5%", 1600), dCell("$50,000", 1600), dCell("$750", 1560)] }),
            new TableRow({ children: [dCell("PROP-SEED-002", 2800, altRowShading), dCell("Zone A / Commercial", 1800, altRowShading), dCell("2.0%", 1600, altRowShading), dCell("$120,000", 1600, altRowShading), dCell("$2,400", 1560, altRowShading)] }),
            new TableRow({ children: [dCell("PROP-SEED-003", 2800), dCell("Zone B / Residential", 1800), dCell("Fixed $500", 1600), dCell("$35,000", 1600), dCell("$500", 1560)] }),
            new TableRow({ children: [dCell("PROP-SEED-004", 2800, altRowShading), dCell("Zone B / Residential", 1800, altRowShading), dCell("Fixed $500", 1600, altRowShading), dCell("$28,000", 1600, altRowShading), dCell("$500", 1560, altRowShading)] }),
            new TableRow({ children: [dCell("PROP-SEED-005", 2800), dCell("Zone C / Industrial", 1800), dCell("3.0%", 1600), dCell("$200,000", 1600), dCell("$6,000", 1560)] }),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== 6. SYSTEM WORKFLOW =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Complete System Workflow")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("The following describes the complete end-to-end workflow of the property tax management process:")] }),

        new Paragraph({ numbering: { reference: "num-workflow", level: 0 }, children: [new TextRun({ text: "System Setup: ", bold: true }), new TextRun("Admin logs in and configures the system by creating user accounts (officers and owners), defining zones, property types, and setting up tax rates for the current tax year.")] }),
        new Paragraph({ numbering: { reference: "num-workflow", level: 0 }, children: [new TextRun({ text: "Owner Registration: ", bold: true }), new TextRun("Tax Officer registers property owners with their personal details (name, phone, national ID, address). Owners can optionally be linked to a user account for portal access.")] }),
        new Paragraph({ numbering: { reference: "num-workflow", level: 0 }, children: [new TextRun({ text: "Property Registration: ", bold: true }), new TextRun("Tax Officer registers properties with details including district, zone, property type, size, assessed value, and usage status. Each property is linked to an owner.")] }),
        new Paragraph({ numbering: { reference: "num-workflow", level: 0 }, children: [new TextRun({ text: "Tax Assessment: ", bold: true }), new TextRun("The system calculates the annual property tax by matching the property\u2019s zone and type to the applicable tax rate. An assessment record is created with the base tax, any penalties or discounts, and the total due.")] }),
        new Paragraph({ numbering: { reference: "num-workflow", level: 0 }, children: [new TextRun({ text: "Bill Generation: ", bold: true }), new TextRun("A bill is created from the assessment with a specified due date. The bill tracks the amount due, amount paid, balance, and status.")] }),
        new Paragraph({ numbering: { reference: "num-workflow", level: 0 }, children: [new TextRun({ text: "Payment Recording: ", bold: true }), new TextRun("Tax Officer records payments against bills. The system supports full and partial payments. After each payment, the bill\u2019s balance and status are automatically updated.")] }),
        new Paragraph({ numbering: { reference: "num-workflow", level: 0 }, children: [new TextRun({ text: "Receipt Generation: ", bold: true }), new TextRun("A receipt is automatically created for each payment with a unique receipt number and optional QR verification token. Receipts can be downloaded as PDF documents.")] }),
        new Paragraph({ numbering: { reference: "num-workflow", level: 0 }, children: [new TextRun({ text: "Owner Self-Service: ", bold: true }), new TextRun("Property owners log into their portal to view their properties, bills, payment history, and download receipts. They can only see data related to their own properties.")] }),
        new Paragraph({ numbering: { reference: "num-workflow", level: 0 }, children: [new TextRun({ text: "Reporting: ", bold: true }), new TextRun("Admin and officers access reports including summary totals, payment collections, outstanding balances, and zone-based breakdowns with date and category filters.")] }),
        new Paragraph({ numbering: { reference: "num-workflow", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Audit Trail: ", bold: true }), new TextRun("All significant actions (user creation, payment recording, bill generation, etc.) are logged in the audit trail with actor, action type, entity, description, and timestamp.")] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== 7. API ENDPOINTS =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. API Endpoints Summary")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("The backend exposes RESTful API endpoints under the /api prefix. All protected routes require a JWT Bearer token.")] }),

        new Table({
          columnWidths: [1600, 3400, 1800, 2560],
          rows: [
            new TableRow({ tableHeader: true, children: [hCell("Method", 1600), hCell("Endpoint", 3400), hCell("Access", 1800), hCell("Purpose", 2560)] }),
            new TableRow({ children: [dCell("POST", 1600), dCell("/auth/login", 3400), dCell("Public", 1800), dCell("User login", 2560)] }),
            new TableRow({ children: [dCell("GET", 1600, altRowShading), dCell("/auth/me", 3400, altRowShading), dCell("Authenticated", 1800, altRowShading), dCell("Current user profile", 2560, altRowShading)] }),
            new TableRow({ children: [dCell("CRUD", 1600), dCell("/users", 3400), dCell("Admin", 1800), dCell("User management", 2560)] }),
            new TableRow({ children: [dCell("CRUD", 1600, altRowShading), dCell("/owners", 3400, altRowShading), dCell("Admin, Officer", 1800, altRowShading), dCell("Owner management", 2560, altRowShading)] }),
            new TableRow({ children: [dCell("CRUD", 1600), dCell("/properties", 3400), dCell("Admin, Officer", 1800), dCell("Property management", 2560)] }),
            new TableRow({ children: [dCell("CRUD", 1600, altRowShading), dCell("/tax-rates", 3400, altRowShading), dCell("Admin (write), All (read)", 1800, altRowShading), dCell("Tax rate configuration", 2560, altRowShading)] }),
            new TableRow({ children: [dCell("POST/GET", 1600), dCell("/assessments", 3400), dCell("Admin, Officer", 1800), dCell("Tax assessments", 2560)] }),
            new TableRow({ children: [dCell("CRUD", 1600, altRowShading), dCell("/bills", 3400, altRowShading), dCell("Admin, Officer", 1800, altRowShading), dCell("Bill management", 2560, altRowShading)] }),
            new TableRow({ children: [dCell("POST/GET", 1600), dCell("/payments", 3400), dCell("Admin, Officer", 1800), dCell("Payment recording", 2560)] }),
            new TableRow({ children: [dCell("GET", 1600, altRowShading), dCell("/receipts/:id/pdf", 3400, altRowShading), dCell("Admin, Officer, Owner*", 1800, altRowShading), dCell("Download receipt PDF", 2560, altRowShading)] }),
            new TableRow({ children: [dCell("GET", 1600), dCell("/reports/*", 3400), dCell("Admin, Officer", 1800), dCell("Reports & analytics", 2560)] }),
            new TableRow({ children: [dCell("GET", 1600, altRowShading), dCell("/audit-logs", 3400, altRowShading), dCell("Admin only", 1800, altRowShading), dCell("Audit trail", 2560, altRowShading)] }),
            new TableRow({ children: [dCell("GET", 1600), dCell("/owner/*", 3400), dCell("Owner only", 1800), dCell("Owner self-service portal", 2560)] }),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== 8. SECURITY =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("8. Security Features")] }),
        new Paragraph({ numbering: { reference: "bullet-security", level: 0 }, children: [new TextRun({ text: "JWT Authentication: ", bold: true }), new TextRun("Stateless token-based authentication. Tokens are issued on login and required for all protected endpoints.")] }),
        new Paragraph({ numbering: { reference: "bullet-security", level: 0 }, children: [new TextRun({ text: "Password Hashing: ", bold: true }), new TextRun("All passwords are hashed using bcrypt before storage. Raw passwords are never stored in the database.")] }),
        new Paragraph({ numbering: { reference: "bullet-security", level: 0 }, children: [new TextRun({ text: "Role-Based Middleware: ", bold: true }), new TextRun("Every API route is protected by role-checking middleware that verifies the user has the required role before processing the request.")] }),
        new Paragraph({ numbering: { reference: "bullet-security", level: 0 }, children: [new TextRun({ text: "Data Isolation: ", bold: true }), new TextRun("Property owners can only access their own data. The system filters queries based on the authenticated user\u2019s linked owner record.")] }),
        new Paragraph({ numbering: { reference: "bullet-security", level: 0 }, children: [new TextRun({ text: "Input Validation: ", bold: true }), new TextRun("All API inputs are validated using express-validator before being processed to prevent injection attacks and data corruption.")] }),
        new Paragraph({ numbering: { reference: "bullet-security", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Audit Logging: ", bold: true }), new TextRun("All significant system actions are recorded with the actor, action type, and timestamp for accountability and forensics.")] }),

        // ===== 9. SEEDED DEMO DATA =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("9. Seeded Demo Data")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Running `npm run seed` in the server directory creates the following demo data for testing and demonstration:")] }),
        new Table({
          columnWidths: [2800, 6560],
          rows: [
            new TableRow({ tableHeader: true, children: [hCell("Data", 2800), hCell("Details", 6560)] }),
            new TableRow({ children: [dCell("Users", 2800), dCell("3 accounts: Admin, Officer, Owner", 6560)] }),
            new TableRow({ children: [dCell("Owners", 2800, altRowShading), dCell("3 owners: Ahmed Hassan (linked to owner account), Fatima Ali, Omar Yusuf", 6560, altRowShading)] }),
            new TableRow({ children: [dCell("Properties", 2800), dCell("5 properties across Zone A, Zone B, Zone C (Residential, Commercial, Industrial)", 6560)] }),
            new TableRow({ children: [dCell("Tax Rates", 2800, altRowShading), dCell("4 rates for 2026: Zone A Residential 1.5%, Zone A Commercial 2.0%, Zone B Residential $500 fixed, Zone C Industrial 3.0%", 6560, altRowShading)] }),
            new TableRow({ children: [dCell("Bills", 2800), dCell("5 bills with mixed statuses: 1 paid, 1 partial, 1 unpaid, 1 overdue, 1 unpaid", 6560)] }),
            new TableRow({ children: [dCell("Payments", 2800, altRowShading), dCell("2 payments: one full (bank), one partial $1000 (mobile money)", 6560, altRowShading)] }),
            new TableRow({ children: [dCell("Receipts", 2800), dCell("2 receipts with QR tokens (RCT-2026-SEED-001, RCT-2026-SEED-002)", 6560)] }),
            new TableRow({ children: [dCell("Audit Logs", 2800, altRowShading), dCell("5 SEED entries recording the data seeding operations", 6560, altRowShading)] }),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== 10. HOW TO RUN =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("10. How to Run the System")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("10.1 Prerequisites")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Node.js version 18 or higher")] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [new TextRun("MongoDB Atlas account (or local MongoDB instance)")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("10.2 Server Setup")] }),
        new Paragraph({ numbering: { reference: "num-phases", level: 0 }, children: [new TextRun("Navigate to the server directory: cd server")] }),
        new Paragraph({ numbering: { reference: "num-phases", level: 0 }, children: [new TextRun("Install dependencies: npm install")] }),
        new Paragraph({ numbering: { reference: "num-phases", level: 0 }, children: [new TextRun("Copy environment file: cp .env.example .env")] }),
        new Paragraph({ numbering: { reference: "num-phases", level: 0 }, children: [new TextRun("Edit .env with your MongoDB URI and JWT secret")] }),
        new Paragraph({ numbering: { reference: "num-phases", level: 0 }, children: [new TextRun("Seed demo data: npm run seed")] }),
        new Paragraph({ numbering: { reference: "num-phases", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Start server: npm run dev (runs on http://localhost:5000)")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("10.3 Client Setup")] }),
        new Paragraph({ numbering: { reference: "num-phases", level: 0 }, children: [new TextRun("Navigate to the client directory: cd client")] }),
        new Paragraph({ numbering: { reference: "num-phases", level: 0 }, children: [new TextRun("Install dependencies: npm install")] }),
        new Paragraph({ numbering: { reference: "num-phases", level: 0 }, children: [new TextRun("Copy environment file: cp .env.example .env")] }),
        new Paragraph({ numbering: { reference: "num-phases", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Start frontend: npm run dev (runs on http://localhost:5173)")] }),

        // ===== 11. CONCLUSION =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("11. Conclusion")] }),
        new Paragraph({ spacing: { after: 200 }, children: [
          new TextRun({ text: "The House Property Tax Management System successfully demonstrates a complete, production-ready web application that digitizes the entire property tax lifecycle. The system provides role-based access control, automated tax calculations, payment tracking with PDF receipts, comprehensive reporting, and full audit trail capabilities. The three-tier architecture with React frontend, Node.js/Express backend, and MongoDB database provides a modern, scalable, and maintainable solution suitable for municipal tax administration." })
        ]}),
        new Paragraph({ spacing: { after: 200 }, children: [
          new TextRun({ text: "The system is designed for extensibility and could be enhanced in the future with features such as SMS notifications, GIS integration, online payment gateways, and multi-language support." })
        ]}),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("System_Documentation.docx", buffer);
  console.log("System_Documentation.docx created successfully!");
});
