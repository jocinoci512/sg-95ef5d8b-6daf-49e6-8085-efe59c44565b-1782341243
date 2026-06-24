---
title: PDF Shipping Document Management
status: done
priority: high
type: feature
tags: [documents, storage, admin, customer]
created_by: agent
created_at: 2026-06-24T00:05:00Z
position: 13
---

## Notes
Build secure PDF document management system allowing admins to upload shipping documents and customers to view/download their shipment documents.

## Checklist
- [x] Create Supabase Storage bucket for documents
- [x] Add shipment_documents database table
- [x] Configure RLS policies for documents
- [x] Add upload UI to admin shipment management
- [x] Add document list/download to admin
- [x] Add document view/download to customer portal
- [x] Implement file validation (PDF only)
- [x] Test security and permissions

## Acceptance
- Admins can upload PDFs to shipments
- Customers can view/download their shipment documents
- Customers cannot access other customers' documents
- File validation prevents non-PDF uploads