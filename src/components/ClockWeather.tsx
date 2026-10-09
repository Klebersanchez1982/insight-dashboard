import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sun, Cloud, CloudRain, CloudSun, CloudLightning, CloudFog } from "lucide-react";

// Monte Alto - SP
const LAT = -21.2611;
const LON = -48.4964;

type Weather = { temp: number; max: number; min: number; code: number; rain: number };

async function fetchWeather(): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FSao_Paulo&forecast_days=1`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("weather");
  const j = await r.json();
  return {
    temp: Math.round(j.current.temperature_2m),
    code: j.current.weather_code,
    max: Math.round(j.daily.temperature_2m_max[0]),
    min: Math.round(j.daily.temperature_2m_min[0]),
    rain: j.daily.precipitation_probability_max[0] ?? 0,
  };
}

function describe(code: number) {
  if (code === 0) return { label: "Céu limpo", Icon: Sun };
  if (code <= 2) return { label: "Parcialmente nublado", Icon: CloudSun };
  if (code === 3) return { label: "Nublado", Icon: Cloud };
  if (code <= 48) return { label: "Neblina", Icon: CloudFog };
  if (code >= 95) return { label: "Tempestade", Icon: CloudLightning };
  return { label: "Chuva", Icon: CloudRain };
}

export const ClockWeather = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const { data: w } = useQuery({
    queryKey: ["weather-monte-alto"],
    queryFn: fetchWeather,
    refetchInterval: 30 * 60 * 1000,
  });

  const hora = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dia = now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
  const desc = w ? describe(w.code) : null;

  return (
    <div className="flex items-center gap-6">
      {w && desc && (
        <div className="flex items-center gap-3 border-r border-border pr-6">
          <desc.Icon className="h-10 w-10 text-primary" />
          <div className="leading-tight">
            <div className="text-2xl font-bold text-foreground">{w.temp}°C</div>
            <div className="text-sm text-muted-foreground">
              {desc.label} · {w.min}°/{w.max}° · Chuva {w.rain}%
            </div>
            <div className="text-xs text-muted-foreground">Monte Alto - SP</div>
          </div>
        </div>
      )}
      <div className="text-right leading-tight">
        <div className="font-mono text-4xl font-bold text-foreground tabular-nums">{hora}</div>
        <div className="text-sm text-muted-foreground capitalize">{dia}</div>
      </div>
    </div>
  );
};
