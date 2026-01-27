Plan: Scroll Reset & PDF Footer / Disclaimer Redesign
Overview

This plan addresses two focused improvements:

Form Scroll Reset
Ensure the page scrolls to the top when navigating between steps.

PDF Visual & Legibility Improvements
Improve the PDF footer and disclaimer sections so they are cleaner, clearer, and more professional, without changing legal meaning or adding unnecessary complexity.

Part 1: Form Scroll-to-Top on Step Change
Current Behaviour

When a user clicks Continue, the page remains at the current scroll position, which is confusing—especially on mobile.

Solution

Scroll the page to the top whenever the step changes.

File to Modify

src/pages/Index.tsx

Implementation

Add the following after the existing state declarations:

useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [currentStep]);

Part 2: PDF Footer Redesign
Current Issues

Footer feels like leftover HTML

Regulatory info is cramped

No clear separation from content above

New Footer Structure (3 Columns)
------------------------------------------------------------
| Acorn Brokers        Regulatory Info          Contact    |
| (logo/text)                                   Details    |
|                                                           
| FSP 47433            Firearms Guardian        Email      |
|                      (Pty) Ltd FSP 47115      Phone      |
|                                                           
|                      Underwritten by                     |
|                      GENRIC Insurance FSP 43638          |
------------------------------------------------------------

Design Guidelines

Font: Helvetica or similar sans-serif

Size: 8–9pt

Colour: Muted grey (#6B7280)

Sentence case

Thin divider line above footer

Comfortable spacing (no dense blocks)

Part 3: PDF Disclaimer & Consent Sections
Goal

Make the existing disclaimers easier to read and visually structured, without rewriting or expanding the legal text.

Placement

After the Important Information box and before the footer.

Section Layout (All Three)

Sections

Debit Order Authorisation

Policy Declaration

POPIA Consent

Design

Title: Bold, 10pt

Body: 9pt

Light grey background panel

Left-aligned text

No more than 6–8 lines visible at once

Content

Use the existing legal wording

May use short bullets for readability

Entity names in semi-bold

Include a simple consent line:

Consented: [timestamp]


👉 No legal expansion.
👉 No restructuring.
👉 Just presentation.

Technical Implementation
File

supabase/functions/_shared/pdfGenerator.ts

Changes

Wrap existing disclaimer text in styled sections

Add spacing and background panels

Redesign footer into 3 columns

Ensure footer stays on final page

Files Summary
File	Change
src/pages/Index.tsx	Scroll-to-top on step change
pdfGenerator.ts	Visual cleanup of footer & disclaimers
Compliance Notes (Minimal)

Minimum font size maintained

Existing legal text unchanged

FSP numbers remain visible