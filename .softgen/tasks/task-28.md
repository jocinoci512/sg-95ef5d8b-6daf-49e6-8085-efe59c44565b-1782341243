---
title: Interactive Shipment Map with Auto-Routing
status: todo
priority: high
type: feature
tags: [maps, tracking, automation]
created_by: agent
created_at: 2026-06-25T18:40:00Z
position: 28
---

## Notes
Implement live interactive map that automatically:
- Geocodes pickup and delivery addresses
- Generates route between locations
- Calculates distance and travel time
- Animates shipment movement along route
- Shows different vehicle types (truck, plane, ship)
- Updates based on status changes

Use Mapbox or Google Maps with animated markers.

## Checklist
- [ ] Integrate mapping library (Mapbox)
- [ ] Create geocoding service for addresses
- [ ] Build route generation function
- [ ] Create animated vehicle markers component
- [ ] Implement progress calculation logic
- [ ] Add ETA calculation
- [ ] Create map component for admin dashboard
- [ ] Create map component for customer tracking
- [ ] Style markers and routes per freight type
- [ ] Add smooth animations

## Acceptance
- Addresses automatically geocoded on shipment creation
- Route displays between pickup and delivery
- Vehicle animates along route based on status
- Distance and ETA calculated accurately