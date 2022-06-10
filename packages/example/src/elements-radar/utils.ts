import { Report } from '@one-for-all/elements-radar';

export function calcPosition(report: Report, { x, y }: { x: number; y: number }): Report {
  report.forEach(({ rect }) => {
    rect.x = Math.round(rect.x + x);
    rect.y = Math.round(rect.y + y);
  });

  return report;
}
