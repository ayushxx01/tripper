# Tech Stack — Chosen and Why

## Backend: Express
Chose Express because I had prior experience with it, and the app only needed basic REST routes — no need for a heavier framework.

## Database: PostgreSQL (with PostGIS)
Used to store `lat`/`lon` of locations for faster retrieval on duplicate requests, avoiding repeated calls to external APIs for the same location. The `geography` column type (via PostGIS) is used to store coordinates properly for spatial queries, rather than storing raw lat/lon as plain numbers.

## OSRM (Open Source Routing Machine)
Used for routing between points on roads (turn-by-turn / distance-based routing). Chose OSRM over Google's Places/Directions API because:
- It's open source and fully transparent — the routing logic can be inspected and replicated by anyone.
- Google's API is paid, and its terms don't allow storing location data returned from it for more than 30 days — which conflicts with the need to persist attraction data long-term.

## Overpass API
Used to fetch all attractions within a specified radius of a point, returning their `lat`, `lon`, `name`, and `id` — which are then stored in PostgreSQL.

- Requires a `User-Agent` header — requests without one are often rejected or rate-limited.
- Three different Overpass mirror URLs are used because the public instances occasionally get overloaded with traffic. The code loops through the mirrors, trying each one; if all three fail, the request is marked failed and can be retried.

## Nominatim API
Used to convert a user-entered location string (e.g. "Kasol") into `lat`/`lon` coordinates, which are then fed into the Overpass API as the search origin.

- Also requires a `User-Agent` header for requests to be accepted.

## Flask (Python microservice)
Used to expose a simple API endpoint that runs K-means clustering. Chose Flask (a separate Python service) rather than doing this in the Node/Express backend because Python's ML ecosystem (scikit-learn) has mature, well-tested clustering implementations — reimplementing or wrapping this in JavaScript wasn't worth it for one algorithm.

The service accepts an array of `{lat, lon}` points and returns the clustered result as JSON.

## K-means Clustering
Used to group nearby attractions into clusters based on their `lat`/`lon`, where `k` = number of days in the trip.

**Example:** for a 3-day trip (`k = 3`), the algorithm groups nearby attractions into 3 clusters:
- Cluster 1 → Day 1's attractions
- Cluster 2 → Day 2's attractions
- Cluster 3 → Day 3's attractions

This keeps each day's attractions geographically close together, minimizing travel time within a single day. The result is returned as JSON.

---

## How it all connects (end-to-end flow)

```
User enters a location + trip duration
        ↓
Express backend receives the request
        ↓
Nominatim → converts location string to lat/lon
        ↓
Overpass API → fetches nearby attractions using that lat/lon
        ↓
PostgreSQL → attractions are stored (for caching / duplicate-request speedup)
        ↓
Flask (K-means) → attractions are clustered into `k` groups (k = number of days)
        ↓
OSRM → computes road routes between attractions within each day's cluster
        ↓
Final day-by-day itinerary is returned to the user
```