# Terrain-Aware Tourist Trip Design

**Road-network-based clustering and itinerary optimization for data-sparse Himalayan regions.**

## The Problem

Existing trip planners — commercial apps and academic Tourist Trip Design Problem (TTDP) research alike — build itineraries using curated data or straight-line (Euclidean) distance. This breaks down in hilly terrain: two points that look close together on a map can be hours apart by actual road, because mountain roads wind, switchback, and cross rivers instead of going direct.

Most systems also don't distinguish between places reachable by road and places reachable only by foot trek — and don't bundle in any cost estimation.

This project automates the full flow: discover attractions in a user-chosen area, group them into day-wise plans, and sequence each day using **real road-network distance** instead of assuming straight-line — applied specifically to Himachal Pradesh, a region where these problems are most visible.

## Why This Approach

| Decision | Reasoning |
|---|---|
| **Terrain-aware, not just "road-aware"** | The mountain's shape is the root cause of both problems this project solves — winding roads (distance accuracy) and road-inaccessible places (trek-only spots). One framing covers both. |
| **OpenStreetMap over Google Places** | Google's Places API terms prohibit storing most returned data long-term — only `place_id` is cacheable indefinitely. This project needs a persistent, queryable dataset for clustering, which OSM's open license (ODbL) explicitly permits building. |
| **OSRM over trusting Google's routing** | Not chosen for superior accuracy — Google's routing is generally more accurate and current. OSRM is chosen for reproducibility (open-source, inspectable methodology) and unrestricted storage of computed results, both required for a research project's defensibility. |
| **K-means for day-grouping** | Unsupervised — no labeled "correct itinerary" data exists to train on. Runs fresh per request since every search covers a different area, with no training phase needed. |
| **PostgreSQL + PostGIS** | Native geospatial queries (`ST_DWithin` for radius search, `ST_X`/`ST_Y` for coordinate extraction) directly in SQL, avoiding manual distance math in application code. |
| **Flask microservice for clustering** | scikit-learn (K-means) is Python-only — rather than reimplementing clustering in JavaScript, Python handles ML, Node handles orchestration, communicating over a simple internal HTTP API. |
| **Accessibility classification before routing** | Found directly during testing: OSRM's default driving profile has no concept of "no road exists here" — it silently returns an incorrect route instead of an error when asked to route to a trek-only location (e.g. Kheerganga, which has zero road access). Points are checked for road-reachability before ever being handed to the routing step. |

### The research gap, specifically

Most TTDP literature is tested on curated benchmark instances or well-mapped cities (Ghent appears constantly), using simplified distance metrics, and rarely includes cost estimation. This project applies the same class of problem to a real, data-sparse Himalayan region using live OpenStreetMap data and real road-network travel time — with a concrete comparative experiment: straight-line vs. road-network-based clustering, measuring how much naive distance assumptions break down in hilly terrain.

## Architecture

```
User input (location, radius, days)
        │
        ▼
Geocoding (Nominatim) ──► lat/lon
        │
        ▼
Search history check (Postgres) ──► already covered? skip Overpass : fetch fresh
        │
        ▼
Attraction discovery (Overpass API, OSM) ──► stored in Postgres + PostGIS
        │
        ▼
Radius query (ST_DWithin) ──► attractions within current request's radius
        │
        ▼
Clustering (Flask + scikit-learn, K-means) ──► day-wise unordered groups
        │
        ▼
(Planned) Cluster chaining ──► ordered Day 1 → Day N sequence
        │
        ▼
(Planned) OSRM routing ──► real road-distance stop ordering within each day
        │
        ▼
Flutter app ──► itinerary display
```

## Tech Stack

- **Node.js + Express** — API orchestration (controller → service → repository layers)
- **PostgreSQL + PostGIS** — persistent geospatial storage
- **Python + Flask + scikit-learn** — clustering microservice
- **OpenStreetMap (Overpass + Nominatim)** — open, storable discovery and geocoding data
- **OSRM** *(planned)* — road-network routing
- **Flutter** *(planned)* — mobile app

## Example

**Request** — `POST /api/attractions/phase1`
```json
{
  "location": "Shimla",
  "radius": 10,
  "days": 3
}
```

**What happens internally:**
1. `"Shimla"` → geocoded to `31.1040393, 77.1707923`
2. Search history checked — no prior search covering this radius found
3. Overpass queried for attractions, viewpoints, waterfalls, hot springs, monuments, places of worship, and villages within 10km
4. 49 attractions discovered and stored in Postgres
5. Current radius re-queried via `ST_DWithin` against stored data
6. Coordinates sent to the Flask clustering service with `days: 3`

**Response** (grouped by K-means, currently unordered — cluster-chaining is the next step):
```json
{
  "0": [[31.1076478, 77.213003], [31.1131558, 77.2479342], "..."],
  "1": [[31.0404082, 77.1246704], [31.0727668, 77.1001625], "..."],
  "2": [[31.1838749, 77.1667027], [31.1835444, 77.1631408], "..."]
}
```

## Current Status

**Working end-to-end:** geocoding → attraction discovery → Postgres storage with dedupe (via `osm_id` as primary key) → radius-based retrieval → K-means clustering.

**Not yet implemented:**
- Re-attaching attraction names/types to clustered coordinates (currently returns raw coordinate pairs only)
- Cluster-chaining (ordering unordered groups into Day 1 → Day N, nearest-to-start first)
- OSRM road-network routing for intra-day stop sequencing
- Road-accessible vs. trek-only classification
- Flutter mobile app
- Accommodation budget estimation (deferred to future scope)

## Known Limitations

- OSM data freshness and coverage vary by region, since it's volunteer-maintained — documented rather than hidden
- Nominatim geocoding accuracy (~70%) is lower than commercial alternatives, acceptable for well-known place names but worth noting for messier address input
- OSRM is not used for its routing accuracy relative to Google, but for reproducibility and open data licensing
