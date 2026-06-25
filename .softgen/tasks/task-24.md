---
title: Enterprise Admin System - Database Schema Enhancement
status: in_progress
priority: urgent
type: feature
tags: [database, admin, foundation]
created_by: agent
created_at: 2026-06-25T18:40:00Z
position: 24
---

## Notes
Extend database schema to support comprehensive enterprise logistics features:
- Multiple freight types (air, ocean, rail, road)
- Geocoding and map coordinates
- Admin activity logging
- Staff permissions system
- Notification templates
- Enhanced shipment tracking
- Document management
- Settings and preferences

Must support all freight types while maintaining existing vehicle shipping functionality.

## Checklist
- [ ] Create shipment_locations table for map tracking
- [ ] Create admin_activity_logs table for audit trail
- [ ] Create notification_templates table
- [ ] Create system_settings table
- [ ] Extend shipments table with coordinates and freight fields
- [ ] Create indexes for performance
- [ ] Add RLS policies for new tables
- [ ] Create helper functions for geocoding and tracking number generation

## Acceptance
- All new tables created with proper constraints and indexes
- RLS policies secure data access
- Existing shipments remain fully compatible