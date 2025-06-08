"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const MapClient: React.FC = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const tt = require("@tomtom-international/web-sdk-maps");
    const ttServices = require("@tomtom-international/web-sdk-services");

    const apiKey = "HyRPaJMF8U1ze1aGjGbwmrVhgFJH8sbT";

    const startLat = parseFloat(searchParams.get("startLat") || "");
    const startLng = parseFloat(searchParams.get("startLng") || "");
    const endLat = parseFloat(searchParams.get("endLat") || "");
    const endLng = parseFloat(searchParams.get("endLng") || "");

    if (
      isNaN(startLat) ||
      isNaN(startLng) ||
      isNaN(endLat) ||
      isNaN(endLng)
    ) {
      console.error("Invalid coordinates");
      return;
    }

    const startCoords: [number, number] = [startLng, startLat];
    const endCoords: [number, number] = [endLng, endLat];

    const map = tt.map({
      key: apiKey,
      container: "map",
      center: startCoords,
      zoom: 10,
    });

    map.on("load", async () => {
      const response = await ttServices.services.calculateRoute({
        key: apiKey,
        traffic: true,
        locations: `${startCoords.join(",")}:${endCoords.join(",")}`,
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

      const bounds = new tt.LngLatBounds();
      geojson.features[0].geometry.coordinates.forEach((point: [number, number]) =>
        bounds.extend(point)
      );

      map.fitBounds(bounds, { padding: 50 });

      // Reverse geocode start and end points
      const startGeo = await ttServices.services.reverseGeocode({
        key: apiKey,
        position: { lon: startCoords[0], lat: startCoords[1] },
      });

      const endGeo = await ttServices.services.reverseGeocode({
        key: apiKey,
        position: { lon: endCoords[0], lat: endCoords[1] },
      });

      const startName =
        startGeo.addresses[0]?.address?.freeformAddress || "Start";
      const endName = endGeo.addresses[0]?.address?.freeformAddress || "End";

      new tt.Marker({ color: "green" }).setLngLat(startCoords).addTo(map);
      new tt.Popup({ offset: 30 })
        .setLngLat(startCoords)
        .setHTML(`<strong>Start:</strong> ${startName}`)
        .addTo(map);

      new tt.Marker({ color: "red" }).setLngLat(endCoords).addTo(map);
      new tt.Popup({ offset: 30 })
        .setLngLat(endCoords)
        .setHTML(`<strong>End:</strong> ${endName}`)
        .addTo(map);

      const coords = geojson.features[0].geometry.coordinates;
      const midIndex = Math.floor(coords.length / 2);
      const midpoint = coords[midIndex];

      new tt.Popup({ offset: 30, anchor: "bottom" })
        .setLngLat(midpoint)
        .setHTML(
          `<div style="font-size: 14px; font-weight: 500;">${routeInfo}</div>`
        )
        .addTo(map);
    });
  }, [searchParams]);

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

export default MapClient;
