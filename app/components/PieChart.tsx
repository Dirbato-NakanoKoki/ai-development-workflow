import { CategoryBreakdown } from '../types';

interface PieChartProps {
  data: CategoryBreakdown[];
}

export default function PieChart({ data }: PieChartProps) {
  if (data.length === 0) {
    return (
      <div className="w-64 h-64 rounded-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">データなし</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  let currentAngle = -90;

  const slices = data.map((item) => {
    const percentage = (item.amount / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...item,
      startAngle,
      endAngle,
      angle,
    };
  });

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      x,
      y,
      'L',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'Z',
    ].join(' ');
  };

  const size = 256;
  const center = size / 2;
  const radius = size / 2 - 10;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-0">
      {slices.map((slice, index) => {
        const path = describeArc(center, center, radius, slice.startAngle, slice.endAngle);
        return (
          <g key={index}>
            <path
              d={path}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
              className="transition-opacity hover:opacity-80"
            />
          </g>
        );
      })}
      <circle cx={center} cy={center} r={radius * 0.5} fill="white" />
    </svg>
  );
}
