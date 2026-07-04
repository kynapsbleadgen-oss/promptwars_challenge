import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { type DiscoveryResult } from "@/lib/discovery.schemas";
import { DURATIONS, BUDGETS } from "@/lib/constants";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { EmptyState } from "@/components/home/EmptyState";
import { Skeletons } from "@/components/home/Skeletons";
import { Results } from "@/components/home/Results";

export const Route = createFileRoute("/discover")({
  component: DiscoverPage,
});

function DiscoverPage() {
  const router = useRouter();
  void router;
  const [location, setLocation] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Ancient History"]);
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);

  const mutation = useMutation<DiscoveryResult, Error, void>({
    mutationFn: async () => {
      return await api<DiscoveryResult>("/discover", {
        method: "POST",
        body: {
          location: location.trim(),
          interests: selectedInterests,
          duration,
          budget,
          travelStyle: "Cultural immersion",
        },
      });
    },
    onError: (err) => toast.error(err.message || "Something went wrong"),
    onSuccess: (data) => {
      if (data.tripId) {
        toast.success("Journey created and auto-saved to your dashboard!");
      } else {
        toast.success("Journey created! Sign in to save your journeys.");
      }
      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    },
  });

  function toggleInterest(i: string) {
    setSelectedInterests((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i].slice(0, 6),
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim()) {
      toast.error("Tell us where you're drawn to.");
      return;
    }
    if (selectedInterests.length === 0) {
      toast.error("Pick at least one interest.");
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <Nav />
      <Hero
        location={location}
        setLocation={setLocation}
        selectedInterests={selectedInterests}
        toggleInterest={toggleInterest}
        duration={duration}
        setDuration={setDuration}
        budget={budget}
        setBudget={setBudget}
        onSubmit={onSubmit}
        loading={mutation.isPending}
      />

      <section id="results" className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        {mutation.isPending && <Skeletons />}
        {mutation.isSuccess && <Results data={mutation.data} />}
        {!mutation.isPending && !mutation.isSuccess && <EmptyState />}
      </section>

      <Footer />
    </div>
  );
}
