import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import client component with SSR disabled
const MapClient = dynamic(() => import("./MapClient"), {
  loading: () => <p>Loading map...</p>,
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading map client...</div>}>
      <MapClient />
    </Suspense>
  );
}
