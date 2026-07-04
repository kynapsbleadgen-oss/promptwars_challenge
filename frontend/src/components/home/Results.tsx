import { useState, useEffect } from "react";
import { toast } from "sonner";

import type { DiscoveryResult } from "@/lib/discovery.schemas";
import { tripApi } from "@/api/tripApi";
import { extractErrorMessage } from "@/api/client";
import { SectionHeading } from "./SectionHeading";
import { DestinationCard } from "./DestinationCard";
import { HiddenGemCard } from "./HiddenGemCard";

export function Results({ data }: { data: DiscoveryResult }) {
  const [tripId, setTripId] = useState<string | null>(data.tripId || null);

  // Sync state if new data is generated
  useEffect(() => {
    setTripId(data.tripId || null);
  }, [data]);

  async function handleSaveTrip() {
    try {
      const firstDest = data.destinations[0];
      const locationName =
        firstDest?.region?.split(",")?.[0] || firstDest?.name || "Curated Destination";

      const trip = await tripApi.create({
        title: `Trip to ${locationName}`,
        location: locationName,
        intro: data.intro,
        destinations: data.destinations,
        hiddenGems: data.hiddenGems,
        status: "published",
      });
      setTripId(trip._id);
      toast.success("Journey saved to your dashboard!");
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to save journey"));
    }
  }

  return (
    <div className="space-y-24">
      <div className="max-w-3xl space-y-6">
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
          Your curated journey
        </span>
        <p className="font-serif text-2xl leading-snug italic lg:text-3xl">
          "{data.intro}"
        </p>
      </div>

      <div>
        <SectionHeading eyebrow="Destinations" title="Places to Wander" />
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
          {data.destinations.map((d, idx) => (
            <DestinationCard 
              key={idx} 
              d={d} 
              index={idx} 
              saved={Boolean(tripId)}
              onSave={handleSaveTrip}
            />
          ))}
        </div>
      </div>

      <div id="hidden-gems">
        <SectionHeading
          eyebrow="Hidden Gems"
          title="Places Only Locals Whisper About"
        />
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {data.hiddenGems.map((g, idx) => (
            <HiddenGemCard key={idx} g={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
