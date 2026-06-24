---
title: PDF Shipping Document Management
status: in_progress
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
- [ ] Create Supabase Storage bucket for documents
- [ ] Add shipment_documents database table
- [ ] Configure RLS policies for documents
- [ ] Add upload UI to admin shipment management
- [ ] Add document list/download to admin
- [ ] Add document view/download to customer portal
- [ ] Implement file validation (PDF only)
- [ ] Test security and permissions

## Acceptance
- Admins can upload PDFs to shipments
- Customers can view/download their shipment documents
- Customers cannot access other customers' documents
- File validation prevents non-PDF uploads