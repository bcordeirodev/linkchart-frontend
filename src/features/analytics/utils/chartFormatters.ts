import type { ChartOptions, ChartSeries } from "@/types";

/**
 * Utilitários para formatação de dados de gráficos
 * Centraliza a lógica de formatação para evitar duplicação
 */

/**
 * Família de fonte padrão usada em todos os gráficos.
 * Mantida como constante para consistência e para facilitar trocas globais.
 */
const CHART_FONT_FAMILY = "Inter, system-ui, sans-serif";

/**
 * Espaçamento da legenda, compartilhado por todos os formatters.
 *
 * O ApexCharts encosta o rótulo no marcador por padrão — "●Residencial", sem
 * respiro —, e empilha os itens sem folga vertical. `markers.offsetX` negativo
 * empurra a bolinha para a esquerda, abrindo o vão até o texto; `itemMargin`
 * separa os itens entre si.
 */
const LEGEND_SPACING = {
  markers: { offsetX: -4 },
  itemMargin: { horizontal: 10, vertical: 4 },
} as const;

/**
 * Configuração de tooltip adaptável ao tema - melhorada
 */
const getTooltipConfig = (isDark = false, clicksLabel = "clicks") => ({
  theme: isDark ? "dark" : "light",
  style: {
    fontSize: "14px",
    fontFamily: CHART_FONT_FAMILY,
    borderRadius: "12px",
    boxShadow: isDark
      ? "0 8px 32px rgba(0, 0, 0, 0.4)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
  fillSeriesColor: false,
  x: {
    show: true,
    formatter: (value: string) => `<strong>${value}</strong>`,
  },
  y: {
    formatter: (value: number) =>
      `<span style="color: #1976d2; font-weight: 600;">${value.toLocaleString()}</span> ${clicksLabel}`,
  },
  marker: {
    show: true,
    radius: 6,
  },
  fixed: {
    enabled: false,
  },
  followCursor: true,
});

/**
 * Configuração de textos adaptável ao tema - melhorada
 */
const getTextConfig = (isDark = false) => {
  const textColor = isDark
    ? "rgba(255, 255, 255, 0.85)"
    : "rgba(0, 0, 0, 0.75)";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const subtitleColor = isDark
    ? "rgba(255, 255, 255, 0.65)"
    : "rgba(0, 0, 0, 0.65)";

  return {
    title: {
      style: {
        fontSize: "16px",
        fontWeight: "600",
        color: textColor,
        fontFamily: CHART_FONT_FAMILY,
      },
    },
    subtitle: {
      style: {
        fontSize: "14px",
        color: subtitleColor,
        fontFamily: CHART_FONT_FAMILY,
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: textColor,
          fontSize: "12px",
          fontFamily: CHART_FONT_FAMILY,
          fontWeight: "500",
        },
        rotate: 0,
        trim: true,
        maxHeight: 60,
      },
      axisBorder: {
        color: gridColor,
        height: 1,
      },
      axisTicks: {
        color: gridColor,
        height: 4,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: textColor,
          fontSize: "12px",
          fontFamily: CHART_FONT_FAMILY,
          fontWeight: "500",
        },
        formatter: (value: number | string) => {
          // Para gráficos horizontais, o yaxis mostra os labels (países)
          // Para gráficos verticais, o yaxis mostra os valores numéricos
          if (typeof value === "string") {
            return value;
          }

          return value.toLocaleString();
        },
      },
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      labels: {
        colors: textColor,
        useSeriesColors: false,
      },
      fontFamily: CHART_FONT_FAMILY,
      fontSize: "13px",
      fontWeight: "500",
      ...LEGEND_SPACING,
    },
  };
};

/**
 * Formata dados para gráfico de área
 */
export const formatAreaChart = (
  data: Record<string, unknown>[],
  xKey: string,
  yKey: string,
  color = "#1976d2",
  isDark = false,
  labels?: { series?: string; noData?: string; clicksLabel?: string },
): { series: ChartSeries[]; options: Record<string, unknown> } => {
  const seriesName = labels?.series ?? "Total";
  const noDataText = labels?.noData ?? "No data available";
  const clicksLabel = labels?.clicksLabel ?? "clicks";

  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      series: [{ name: seriesName, data: [] }],
      options: {
        chart: { type: "area" },
        colors: [color],
        noData: { text: noDataText },
        tooltip: getTooltipConfig(isDark, clicksLabel),
        ...getTextConfig(isDark),
      },
    };
  }

  return {
    series: [
      {
        name: seriesName,
        data: data
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            x: String(
              item[xKey] !== undefined && item[xKey] !== null ? item[xKey] : "",
            ),
            y: Number(item[yKey] || 0),
          })),
      },
    ],
    options: {
      chart: {
        type: "area",
        borderRadius: 12,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      colors: [color],
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: [color],
          inverseColors: false,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
        lineCap: "round",
      },
      markers: {
        size: 0,
        hover: {
          size: 8,
          sizeOffset: 2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: getTooltipConfig(isDark, clicksLabel),
      ...getTextConfig(isDark),
    },
  };
};

/** Shared label styles for horizontal and vertical bar charts. */
const getBarLabelStyle = (isDark: boolean) => ({
  colors: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
  fontSize: "12px",
  fontFamily: CHART_FONT_FAMILY,
});

/**
 * Formata dados para gráfico de barras
 */
export const formatBarChart = (
  data: Record<string, unknown>[],
  xKey: string,
  yKey: string,
  color = "#1976d2",
  horizontal = false,
  isDark = false,
  labels?: { series?: string; noData?: string; clicksLabel?: string },
): { series: ChartSeries[]; options: Record<string, unknown> } => {
  const seriesName = labels?.series ?? "Clicks";
  const noDataText = labels?.noData ?? "No data available";
  const _clicksLabel = labels?.clicksLabel ?? "clicks";

  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      series: [{ name: seriesName, data: [] }],
      options: {
        chart: { type: "bar" },
        colors: [color],
        noData: { text: noDataText },
      },
    };
  }

  // Process data once — shared by both horizontal and vertical paths
  const processedData = data
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      x: String(
        item[xKey] !== undefined && item[xKey] !== null ? item[xKey] : "",
      ),
      y: Number(item[yKey] || 0),
    }));

  const labelStyle = getBarLabelStyle(isDark);
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  // Configuração simplificada para barras horizontais
  if (horizontal) {
    return {
      series: [{ name: seriesName, data: processedData }],
      options: {
        chart: {
          type: "bar",
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
          },
        },
        colors: [color],
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 2,
            barHeight: "60%",
            distributed: false,
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#fff"],
            fontSize: "11px",
            fontWeight: "bold",
            fontFamily: CHART_FONT_FAMILY,
          },
          formatter(val: number) {
            return val.toString();
          },
        },
        xaxis: {
          type: "numeric",
          labels: { style: labelStyle },
        },
        yaxis: {
          labels: { style: labelStyle },
        },
        grid: {
          borderColor: gridColor,
          xaxis: { lines: { show: true } },
          yaxis: { lines: { show: false } },
        },
        tooltip: getTooltipConfig(isDark),
        fill: { opacity: 1 },
        stroke: { show: true, width: 1, colors: ["transparent"] },
      },
    };
  }

  // Configuração para barras verticais
  return {
    series: [{ name: seriesName, data: processedData }],
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      colors: [color],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 2,
          columnWidth: "60%",
          distributed: false,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: [isDark ? "#fff" : "#333"],
          fontSize: "11px",
          fontWeight: "bold",
          fontFamily: CHART_FONT_FAMILY,
        },
        formatter(val: number) {
          return val.toString();
        },
        offsetY: -20,
      },
      fill: { opacity: 1, type: "solid" },
      stroke: { show: true, width: 1, colors: ["transparent"] },
      xaxis: {
        type: "category",
        labels: { style: labelStyle },
      },
      yaxis: {
        labels: {
          style: labelStyle,
          formatter: (value: number) => Math.round(value).toString(),
        },
      },
      grid: {
        borderColor: gridColor,
        padding: { right: 0 },
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
      },
      tooltip: getTooltipConfig(isDark),
    },
  };
};

/**
 * Formata dados para gráfico de pizza/donut
 */
export const formatPieChart = (
  data: Record<string, unknown>[],
  labelKey: string,
  valueKey: string,
  isDark = false,
  labels?: { noData?: string },
): { series: number[]; options: ChartOptions } => {
  const noDataText = labels?.noData ?? "No data available";

  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      series: [],
      options: {
        chart: { type: "donut" },
        labels: [],
        noData: { text: noDataText },
        tooltip: getTooltipConfig(isDark),
      },
    };
  }

  const filteredData = data.filter((item) => item && typeof item === "object");

  const textColor = isDark
    ? "rgba(255, 255, 255, 0.85)"
    : "rgba(0, 0, 0, 0.75)";

  return {
    series: filteredData.map((item) => Number(item[valueKey] || 0)),
    options: {
      chart: {
        type: "donut",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      labels: filteredData.map((item) => String(item[labelKey] || "")),
      colors: [
        "#1976d2",
        "#2e7d32",
        "#dc004e",
        "#9c27b0",
        "#ff9800",
        "#d32f2f",
        "#0288d1",
        "#7b1fa2",
      ],
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "14px",
                fontFamily: CHART_FONT_FAMILY,
                fontWeight: 600,
                color: textColor,
              },
              value: {
                show: true,
                fontSize: "16px",
                fontFamily: CHART_FONT_FAMILY,
                fontWeight: 700,
                color: isDark
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(0, 0, 0, 0.8)",
                formatter: (val: string) => parseInt(val).toLocaleString(),
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        ...getTooltipConfig(isDark),
        y: {
          formatter: (value: number) =>
            `<span style="color: #1976d2; font-weight: 600;">${value.toLocaleString()}</span>`,
        },
      },
      // No fixed legend height: with the global <600 px rule flipping the
      // legend to `position: bottom`, a fixed height would consume the whole
      // chart canvas and collapse the pie radius to ~0 on mobile.
      legend: {
        position: "right",
        offsetY: 0,
        labels: {
          colors: textColor,
          useSeriesColors: false,
        },
        fontFamily: CHART_FONT_FAMILY,
        fontSize: "13px",
        fontWeight: "500",
        ...LEGEND_SPACING,
      },
    },
  };
};
