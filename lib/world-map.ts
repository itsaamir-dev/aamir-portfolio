import "server-only";
import { geoBounds, geoContains, geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/countries-110m.json";

export const MAP_W = 960;
export const MAP_H = 470;

type Country = Feature<Geometry, { name: string }>;

let cache: { countries: Country[]; paths: string[]; bounds: [[number, number], [number, number]][]; project: (p: [number, number]) => [number, number] | null } | null = null;

/** Country shapes projected once per server instance (Natural Earth, Antarctica dropped). */
function load() {
  if (cache) return cache;
  const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  const all = (feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>).features;
  const countries = all.filter(f => f.properties.name !== "Antarctica");
  const projection = geoNaturalEarth1().fitExtent([[8, 8], [MAP_W - 8, MAP_H - 8]], { type: "FeatureCollection", features: countries } as GeoPermissibleObjects);
  const path = geoPath(projection);
  cache = {
    countries,
    paths: countries.map(c => path(c) ?? ""),
    bounds: countries.map(c => geoBounds(c)),
    project: p => projection(p),
  };
  return cache;
}

export type MapCountry = { d: string; name: string; views: number };
export type MapPoint = { x: number; y: number; label: string; views: number; visitors: number };

/**
 * Builds the map: every country path with the views that fall inside it, and
 * one projected point per city. Countries are matched by geometry (the city's
 * coordinates), so no country-code table is needed.
 */
export function buildMap(cities: { city: string; region: string | null; country: string | null; lat: number; lon: number; views: number; visitors: number }[]) {
  const { countries, paths, bounds, project } = load();
  const views = new Array<number>(countries.length).fill(0);
  const points: MapPoint[] = [];

  for (const c of cities) {
    const lonlat: [number, number] = [c.lon, c.lat];
    const xy = project(lonlat);
    if (xy) {
      const where = [c.city, c.country].filter(Boolean).join(", ");
      points.push({ x: Math.round(xy[0] * 10) / 10, y: Math.round(xy[1] * 10) / 10, label: where, views: c.views, visitors: c.visitors });
    }
    for (let i = 0; i < countries.length; i++) {
      const [[w, s], [e, n]] = bounds[i];
      const inBox = c.lat >= s && c.lat <= n && (w <= e ? c.lon >= w && c.lon <= e : c.lon >= w || c.lon <= e);
      if (inBox && geoContains(countries[i], lonlat)) { views[i] += c.views; break; }
    }
  }

  const shapes: MapCountry[] = countries.map((c, i) => ({ d: paths[i], name: c.properties.name, views: views[i] }));
  return { shapes, points, width: MAP_W, height: MAP_H };
}
