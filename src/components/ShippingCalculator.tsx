import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, MapPin, Truck, DollarSign } from "lucide-react";

const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
};

export function ShippingCalculator() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    vehicleType: "",
    shippingMethod: "",
    expedited: false,
  });
  const [currency, setCurrency] = useState<keyof typeof exchangeRates>("USD");
  const [result, setResult] = useState<{
    cost: number;
    transitTime: string;
    distance: number;
  } | null>(null);

  const calculateCost = () => {
    if (!formData.vehicleType || !formData.shippingMethod) return;

    const baseRates: Record<string, number> = {
      sedan: 500,
      suv: 650,
      truck: 700,
      luxury: 850,
      motorcycle: 400,
      heavy_equipment: 1500,
    };

    const methodMultipliers: Record<string, number> = {
      open_carrier: 1.0,
      enclosed_carrier: 1.5,
      expedited: 1.8,
      international: 2.5,
      motorcycle_transport: 1.2,
      heavy_equipment_transport: 2.0,
    };

    const distance = Math.floor(Math.random() * 1500) + 300;
    const baseCost = baseRates[formData.vehicleType] || 500;
    const methodMultiplier = methodMultipliers[formData.shippingMethod] || 1.0;
    const distanceMultiplier = 1 + (distance / 2000);
    const expeditedMultiplier = formData.expedited ? 1.3 : 1.0;

    const totalCost = baseCost * methodMultiplier * distanceMultiplier * expeditedMultiplier;

    const transitDays = formData.expedited
      ? Math.ceil(distance / 500)
      : Math.ceil(distance / 300);

    setResult({
      cost: Math.round(totalCost),
      transitTime: `${transitDays}-${transitDays + 2}`,
      distance,
    });
  };

  const convertCurrency = (amount: number) => {
    return Math.round(amount * exchangeRates[currency]);
  };

  const getCurrencySymbol = () => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "CA$",
    };
    return symbols[currency];
  };

  return (
    <Card className="p-8 border-border">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">{t("calc.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("calc.description")}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label>{t("calc.pickupLocation")}</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Los Angeles, CA"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("calc.deliveryLocation")}</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="New York, NY"
              value={formData.deliveryLocation}
              onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("calc.vehicleType")}</Label>
          <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="truck">Pickup Truck</SelectItem>
              <SelectItem value="luxury">Luxury Vehicle</SelectItem>
              <SelectItem value="motorcycle">Motorcycle</SelectItem>
              <SelectItem value="heavy_equipment">Heavy Equipment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("calc.shippingMethod")}</Label>
          <Select value={formData.shippingMethod} onValueChange={(value) => setFormData({ ...formData, shippingMethod: value })}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select shipping method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open_carrier">Open Carrier</SelectItem>
              <SelectItem value="enclosed_carrier">Enclosed Carrier</SelectItem>
              <SelectItem value="expedited">Expedited Transport</SelectItem>
              <SelectItem value="international">International Shipping</SelectItem>
              <SelectItem value="motorcycle_transport">Motorcycle Transport</SelectItem>
              <SelectItem value="heavy_equipment_transport">Heavy Equipment Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("calc.currency")}</Label>
          <Select value={currency} onValueChange={(value: any) => setCurrency(value)}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="CAD">CAD (CA$)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.expedited}
              onChange={(e) => setFormData({ ...formData, expedited: e.target.checked })}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium">{t("calc.expedited")}</span>
          </label>
        </div>
      </div>

      <Button onClick={calculateCost} size="lg" className="w-full font-mono mb-6">
        <Calculator className="mr-2 h-5 w-5" />
        {t("calc.calculate")}
      </Button>

      {result && (
        <div className="border-t border-border pt-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t("calc.estimatedCost")}</span>
              </div>
              <p className="text-2xl font-bold text-primary font-mono">
                {getCurrencySymbol()}{convertCurrency(result.cost).toLocaleString()}
              </p>
              {currency !== "USD" && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t("calc.basePrice")}: ${result.cost.toLocaleString()} USD
                </p>
              )}
            </div>

            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t("calc.transitTime")}</span>
              </div>
              <p className="text-2xl font-bold font-mono">
                {result.transitTime} {t("calc.days")}
              </p>
            </div>

            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t("calc.distance")}</span>
              </div>
              <p className="text-2xl font-bold font-mono">
                {result.distance} {t("calc.miles")}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            * Estimates are based on distance, vehicle type, and shipping method. Final quotes may vary. Contact us for accurate pricing.
          </p>
        </div>
      )}
    </Card>
  );
}