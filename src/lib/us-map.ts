import { geoAlbersUsa, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature, mesh, merge } from "topojson-client";
import type { GeometryCollection } from "topojson-specification";
// us-atlas ships pre-simplified topojson for US states, bundled with the
// package -- no network request needed at build or run time.
import statesTopology from "us-atlas/states-10m.json";

const WIDTH = 975;
const HEIGHT = 610;

const projection = geoAlbersUsa().scale(1300).translate([WIDTH / 2, HEIGHT / 2]);
const path = geoPath(projection);

const topology = statesTopology as unknown as Parameters<typeof feature>[0];
const statesObj = (topology.objects as Record<string, GeometryCollection>)
  .states;

export function getStatePaths() {
  const geo = feature(topology, statesObj) as unknown as {
    features: { id: string | number; geometry: GeoPermissibleObjects }[];
  };
  return geo.features
    .map((f) => ({ id: f.id, d: path(f.geometry) }))
    .filter((f): f is { id: string | number; d: string } => Boolean(f.d));
}

// A two-weight cartographic treatment -- one filled landmass, a faint
// interior mesh for state lines, and a bolder national outline -- instead
// of stroking all 50 states identically flat. Reads as a real map at a
// glance instead of a beige silhouette.
export function getUsMapGeometry() {
  const land = path(
    merge(
      topology,
      statesObj.geometries as unknown as Parameters<typeof merge>[1]
    ) as GeoPermissibleObjects
  );
  const interior = path(
    mesh(topology, statesObj, (a, b) => a !== b) as GeoPermissibleObjects
  );
  const outline = path(
    mesh(topology, statesObj, (a, b) => a === b) as GeoPermissibleObjects
  );
  return { land: land ?? "", interior: interior ?? "", outline: outline ?? "" };
}

export function projectPoint(lon: number, lat: number) {
  const p = projection([lon, lat]);
  if (!p) return null;
  return { x: p[0], y: p[1] };
}

export const MAP_VIEWBOX = `0 0 ${WIDTH} ${HEIGHT}`;
