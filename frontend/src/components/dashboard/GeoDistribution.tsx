import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountryFlag } from "@/components/ui/country-flag";
import { getCityCountryCode } from "@/lib/countries";

interface CountryData {
  name: string;
  countryCode: string;
  count: number;
  percentage: number;
}

interface CityData {
  name: string;
  countryCode?: string;
  count: number;
  percentage: number;
}

interface GeoDistributionProps {
  countries: CountryData[];
  cities?: CityData[];
}

export function GeoDistribution({ countries, cities = [] }: GeoDistributionProps) {
  const [view, setView] = useState<"countries" | "cities">("countries");

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <Tabs defaultValue="countries" className="mb-4" onValueChange={(v) => setView(v as "countries" | "cities")}>
          <TabsList className="bg-muted h-9">
            <TabsTrigger value="countries" className="text-xs font-mono uppercase tracking-wider">
              Countries
            </TabsTrigger>
            <TabsTrigger value="cities" className="text-xs font-mono uppercase tracking-wider">
              Cities
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <p className="text-sm text-muted-foreground mb-6">
          User distribution by {view === "countries" ? "country" : "city"}
        </p>

        <div className="space-y-5">
          {view === "countries" ? (
            countries.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CountryFlag countryCode={item.countryCode} showName />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground">{item.count}</span>
                    <span className="text-sm text-muted-foreground">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            cities.map((item) => {
              const cityCountryCode = item.countryCode || getCityCountryCode(item.name);
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {cityCountryCode && <CountryFlag countryCode={cityCountryCode} />}
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-foreground">{item.count}</span>
                      <span className="text-sm text-muted-foreground">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
