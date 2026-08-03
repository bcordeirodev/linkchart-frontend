/**
 * Tema base do ApexCharts (redesign "instrumento técnico", 2026-08-03).
 *
 * `buildApexBaseOptions` é a fonte única das opções visuais compartilhadas
 * por todos os gráficos do app; `mergeApexOptions` é o deep merge usado
 * para aplicar essa base sob os overrides pontuais de cada tela.
 */

import type { Theme } from "@mui/material/styles";
import type { ApexOptions } from "apexcharts";

import { dataVizPalette } from "@/lib/theme/dataViz";

/**
 * Opções base de todos os gráficos ApexCharts do app (spec 2026-08-03).
 * Linhas 2px, grid só horizontal quase invisível, eixos em mono 11px,
 * área 18%→0, barras raio 2, tooltip dark com números em mono.
 */
export function buildApexBaseOptions(theme: Theme): ApexOptions {
  const mono = "var(--font-jetbrains-mono), ui-monospace, monospace";
  return {
    chart: {
      toolbar: { show: false },
      fontFamily: theme.typography.fontFamily,
    },
    colors: [...Object.values(dataVizPalette)],
    stroke: { width: 2, curve: "smooth", lineCap: "round" },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 0.18,
        opacityTo: 0,
        stops: [0, 95],
      },
    },
    plotOptions: { bar: { borderRadius: 2, columnWidth: "45%" } },
    xaxis: {
      labels: { style: { fontFamily: mono, fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { fontFamily: mono, fontSize: "11px" } } },
    tooltip: { theme: "dark", style: { fontFamily: mono } },
    legend: { fontFamily: mono, fontSize: "11px", markers: { size: 4 } },
  };
}

/** A plain, mergeable object — anything that is not an array, function, or class instance. */
type PlainObject = Record<string, unknown>;

/**
 * Type guard for `PlainObject`: a non-null object literal, excluding arrays
 * and instances of classes other than `Object` (so `Date`, custom class
 * instances, etc. are treated as opaque values, not merge targets).
 */
function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    value.constructor === Object
  );
}

/**
 * Recursive object merge used internally by `mergeApexOptions`.
 * Keys present on both sides merge recursively when both values are plain
 * objects; otherwise the key from `overrides` wins outright.
 */
function deepMergeObjects(
  base: PlainObject,
  overrides: PlainObject,
): PlainObject {
  const result: PlainObject = { ...base };

  for (const key of Object.keys(overrides)) {
    const baseValue = base[key];
    const overrideValue = overrides[key];

    result[key] =
      isPlainObject(baseValue) && isPlainObject(overrideValue)
        ? deepMergeObjects(baseValue, overrideValue)
        : overrideValue;
  }

  return result;
}

/**
 * Deep-merges two `ApexOptions` objects with no external dependency
 * (no lodash) — small enough to audit by hand.
 *
 * Semantics: when the same key exists on both sides and both values are
 * plain objects (not arrays, not functions, not class instances), they
 * merge recursively. In every other case — arrays, strings, numbers,
 * booleans, functions — the value from `overrides` wins and replaces the
 * one from `base` entirely. Arrays are never concatenated or merged
 * item-by-item: a caller passing `colors: [...]` fully replaces the base
 * palette, it never blends with it.
 *
 * @param base Base options — typically `buildApexBaseOptions(theme)`.
 * @param overrides Per-chart options passed by the caller; they win on conflict.
 */
export function mergeApexOptions(
  base: ApexOptions,
  overrides: ApexOptions,
): ApexOptions {
  return deepMergeObjects(
    base as PlainObject,
    overrides as PlainObject,
  ) as ApexOptions;
}
