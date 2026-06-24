import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function TrackingForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      router.push(`/track?number=${encodeURIComponent(trackingNumber.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("track.placeholder")}
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="pl-10 h-12 bg-background"
          required
        />
      </div>
      <Button type="submit" size="lg" className="font-mono">
        {t("track.button")}
      </Button>
    </form>
  );
}