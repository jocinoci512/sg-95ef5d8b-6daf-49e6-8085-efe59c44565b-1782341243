import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/router";

export function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      router.push(`/track?number=${encodeURIComponent(trackingNumber.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <Input
        type="text"
        placeholder="Enter tracking number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        className="flex-1 h-12 font-data bg-card"
        required
      />
      <Button type="submit" size="lg" className="font-mono px-8">
        <Search className="h-4 w-4 mr-2" />
        Track
      </Button>
    </form>
  );
}