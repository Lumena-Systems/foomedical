// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { ChartData, ChartOptions } from 'chart.js';
import { lazy, Suspense, useMemo  } from 'react';
import type {JSX} from 'react';

interface LineChartProps {
  readonly chartData: ChartData<'line', number[]>;
}

const AsyncLine = lazy(async () => {
  const { CategoryScale, Chart, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } =
    await import('chart.js');
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
  const { Line } = await import('react-chartjs-2');
  return { default: Line };
});

function readVar(name: string, fallback: string): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {return fallback;}
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export function LineChart({ chartData }: LineChartProps): JSX.Element {
  const { options, data } = useMemo(() => {
    const inkAxis = readVar('--fg-muted', '#5a6577');
    const inkGrid = readVar('--border-quiet', '#dcd9d2');
    const twilight = readVar('--twilight-500', '#3a7a8c');
    const twilightSoft = readVar('--twilight-200', '#bcd6dd');

    const palette = [twilight, readVar('--ink-700', '#3d434d'), readVar('--twilight-700', '#1f4a55')];

    const styledDatasets = chartData.datasets.map((ds, i) => {
      const stroke = palette[i % palette.length];
      return {
        ...ds,
        borderColor: stroke,
        backgroundColor: i === 0 ? twilightSoft : stroke,
        borderWidth: 1.5,
        pointRadius: 2.5,
        pointHoverRadius: 4,
        pointBackgroundColor: stroke,
        pointBorderColor: stroke,
        tension: 0.25,
        fill: false,
      };
    });

    const opts: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          min: 0,
          ticks: { color: inkAxis, font: { family: 'IBM Plex Mono, ui-monospace, monospace', size: 11 } },
          grid: { color: inkGrid },
          border: { color: inkGrid },
        },
        x: {
          ticks: { color: inkAxis, font: { family: 'IBM Plex Mono, ui-monospace, monospace', size: 11 } },
          grid: { display: false },
          border: { color: inkGrid },
        },
      },
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            color: inkAxis,
            font: { family: 'Inter Tight, system-ui, sans-serif', size: 12 },
            boxWidth: 12,
            boxHeight: 2,
            usePointStyle: false,
          },
        },
        tooltip: {
          backgroundColor: readVar('--ink-900', '#1a1f29'),
          titleColor: readVar('--paper-50', '#fafaf7'),
          bodyColor: readVar('--paper-50', '#fafaf7'),
          borderColor: 'transparent',
          padding: 10,
          cornerRadius: 4,
          titleFont: { family: 'Inter Tight, system-ui, sans-serif', size: 12, weight: 600 },
          bodyFont: { family: 'IBM Plex Mono, ui-monospace, monospace', size: 12 },
        },
      },
    };

    return { options: opts, data: { ...chartData, datasets: styledDatasets } };
  }, [chartData]);

  return (
    <div>
      <Suspense
        fallback={<div style={{ height: 2, background: 'var(--paper-200)', width: '100%' }} />}
      >
        <AsyncLine options={options} data={data} />
      </Suspense>
    </div>
  );
}
