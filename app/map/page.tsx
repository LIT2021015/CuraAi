"use client";
import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    const tt = require("@tomtom-international/web-sdk-maps");
    const ttServices = require("@tomtom-international/web-sdk-services");

    const apiKey = "HyRPaJMF8U1ze1aGjGbwmrVhgFJH8sbT";
    const end = [80.9873664, 26.8575];
    const start = [81.0242111, 26.80083];

    const map = tt.map({
      key: apiKey,
      container: "map",
      center: start,
      zoom: 10,
    });

    map.on("load", async () => {
      // Route
      const response = await ttServices.services.calculateRoute({
        key: apiKey,
        traffic: true,
        locations: `${start.join(",")}:${end.join(",")}`,
      });

      const geojson = response.toGeoJson();
      const summary = response.routes[0].summary;

      const minutes = Math.floor(summary.travelTimeInSeconds / 60);
      const seconds = summary.travelTimeInSeconds % 60;
      const distanceKm = (summary.lengthInMeters / 1000).toFixed(2);
      const routeInfo = `🚗 <strong>${minutes} min ${seconds} sec</strong> | 📍 ${distanceKm} km`;


      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geojson,
        },
        paint: {
          "line-color": "#4a90e2",
          "line-width": 6,
        },
      });

      // Fit map to route
      const bounds = new tt.LngLatBounds();
      geojson.features[0].geometry.coordinates.forEach((point) => {
        bounds.extend(point);
      });
      map.fitBounds(bounds, { padding: 50 });

      // Reverse geocoding to get addresses
      const startGeo = await ttServices.services.reverseGeocode({
        key: apiKey,
        position: { lon: start[0], lat: start[1] },
      });
      const endGeo = await ttServices.services.reverseGeocode({
        key: apiKey,
        position: { lon: end[0], lat: end[1] },
      });

      const startName =
        startGeo.addresses[0]?.address?.freeformAddress || "Start";
      const endName = endGeo.addresses[0]?.address?.freeformAddress || "End";

      // Green start marker
      const startMarker = new tt.Marker({ color: "green" })
        .setLngLat(start)
        .addTo(map);
      new tt.Popup({ offset: 30 })
        .setLngLat(start)
        .setHTML(`<strong>Start:</strong> ${startName}`)
        .addTo(map);

      // Red end marker
      const endMarker = new tt.Marker({ color: "red" })
        .setLngLat(end)
        .addTo(map);
      new tt.Popup({ offset: 30 })
        .setLngLat(end)
        .setHTML(`<strong>End:</strong> ${endName}`)
        .addTo(map);

      const coords = geojson.features[0].geometry.coordinates;
      const midIndex = Math.floor(coords.length / 2);
      const midpoint = coords[midIndex];

      new tt.Popup({ offset: 30, anchor: "bottom" })
        .setLngLat(midpoint)
        .setHTML(`<div style="font-size: 14px; font-weight: 500;">${routeInfo}</div>`)
        .addTo(map);
    });
  }, []);

  return (
    <>
      <div id="map" className="h-screen w-full"></div>
      <link
        rel="stylesheet"
        href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps.css"
      />
      <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps-web.min.js"></script>
      <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/services/services-web.min.js"></script>
    </>
  );
};

export default Page;
