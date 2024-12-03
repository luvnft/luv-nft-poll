import React from 'react';

interface ArrowIconProps {
  color?: string; // Optional color prop for the arrow
  opacity?: number; // Optional opacity prop for the arrow
  className?: string; // Optional className for additional styling
}

const ArrowIcon: React.FC<ArrowIconProps> = ({
  color = "#33CB82",
  opacity = 0.5,
  className = "",
}) => {
  return (
    <svg
      width="249"
      height="242"
      viewBox="0 0 249 242"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M248.006 26.6159C248.346 15.5754 239.672 6.34963 228.631 6.00946L48.7165 0.466561C37.6761 0.126421 28.4503 8.80074 28.1101 19.8412C27.77 30.8817 36.4443 40.1075 47.4848 40.4476L207.409 45.3746L202.482 205.299C202.142 216.339 210.816 225.565 221.857 225.905C232.897 226.245 242.123 217.571 242.463 206.531L248.006 26.6159ZM27.6999 241.793L241.715 40.5709L214.315 11.4291L0.300063 212.651L27.6999 241.793Z"
        fill={color}
        fillOpacity={opacity}
      />
    </svg>
  );
};

export default ArrowIcon;
