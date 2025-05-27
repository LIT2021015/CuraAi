"use client";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    const tt = require("@tomtom-international/web-sdk-maps");
    const ttServices = require("@tomtom-international/web-sdk-services");

    const map = tt.map({
      key: "HyRPaJMF8U1ze1aGjGbwmrVhgFJH8sbT",
      container: "map",
      center: [80.9873664, 26.8575],
      zoom: 10,
    });

    map.on("load", function () {
      ttServices.services
        .calculateRoute({
          key: "HyRPaJMF8U1ze1aGjGbwmrVhgFJH8sbT",
          traffic: true,
          locations: "80.9873664,26.8575:81.0242111,26.80083",
        })
        .then((response: any) => {
          const geojson = response.toGeoJson();

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
          geojson.features[0].geometry.coordinates.forEach((point: any) => {
            bounds.extend(point);
          });
          map.fitBounds(bounds, { padding: 50 });
        });
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

export default page;
