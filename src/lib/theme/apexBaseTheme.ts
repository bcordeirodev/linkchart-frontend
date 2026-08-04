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
import { typographyScale } from "@/lib/theme/designSystem";

/** The chart-kind literal ApexCharts itself uses for `chart.type` (e.g. `"area"`, `"bar"`, `"donut"`). */
type ApexChartKind = NonNullable<ApexOptions["chart"]>["type"];

/**
 * `fill` block used by `buildApexBaseOptions`.
 *
 * The 18%→0 gradient wash is reserved for **area** charts — that is its only
 * purpose (a subtle fill under the line). Every other chart kind — bar/column
 * (horizontal or not, stacked or not), line, donut/pie, radialBar, scatter,
 * bubble, heatmap, treemap — and the case where the caller doesn't tell us
 * the kind at all, gets a **solid** fill at full opacity. This is what keeps
 * bars solid by default everywhere without any screen having to opt out
 * manually: the gradient only turns on when `chartType` is explicitly `"area"`.
 */
function buildFillOptions(
  chartType: ApexChartKind | undefined,
): ApexOptions["fill"] {
  if (chartType === "area") {
    return {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 0.18,
        opacityTo: 0,
        stops: [0, 95],
      },
    };
  }

  return { type: "solid", opacity: 1 };
}

/**
 * Opções base de todos os gráficos ApexCharts do app (spec 2026-08-03).
 * Linhas 2px, grid só horizontal quase invisível, eixos em mono 11px,
 * barras raio 2, tooltip dark com números em mono.
 *
 * `fill` depende de `chartType` (ver `buildFillOptions`): gradiente 18%→0
 * somente quando `chartType === "area"`; qualquer outro tipo — ou a
 * ausência de `chartType` — usa fill sólido a 100% de opacidade, para que
 * barras (e fatias de donut/pie, enquanto existirem) nunca fiquem
 * translúcidas.
 *
 * @param theme Tema MUI ativo — usado para tipografia, divider e paleta.
 * @param chartType Tipo efetivo do gráfico (`chart.type`/prop `type` do
 * `ApexChartWrapper`). Opcional; quando omitido, o fill cai no caso sólido.
 */
export function buildApexBaseOptions(
  theme: Theme,
  chartType?: ApexChartKind,
): ApexOptions {
  const mono = typographyScale.code.fontFamily;
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
    fill: buildFillOptions(chartType),
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
 * objects; otherwise the key from `overrides` wins outright — except an
 * `undefined` override value, which is ignored so the `base` value survives
 * (same convention as lodash's `merge`). An explicit `null` override is not
 * special-cased: it is assigned as-is and replaces the base value.
 */
function deepMergeObjects(
  base: PlainObject,
  overrides: PlainObject,
): PlainObject {
  const result: PlainObject = { ...base };

  for (const key of Object.keys(overrides)) {
    const baseValue = base[key];
    const overrideValue = overrides[key];

    if (overrideValue === undefined) {
      // An override key explicitly set to `undefined` (e.g. `chart: cond ? {...} : undefined`)
      // must not erase the base value — skip it and keep `baseValue` (already in `result` via the spread above).
      continue;
    }

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
 * `undefined` vs `null` on the override side are handled differently: a key
 * with an `undefined` override value is ignored entirely, so the `base`
 * value passes through untouched (this lets callers write conditional
 * options like `{ chart: cond ? {...} : undefined }` without accidentally
 * wiping out the base config). An explicit `null` override, by contrast, is
 * treated as a deliberate value and is assigned as-is, replacing `base`.
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
