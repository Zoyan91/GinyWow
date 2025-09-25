import { memo } from 'react';

interface FloatingShapesProps {
  count?: number;
  sizes?: ('small' | 'medium' | 'large')[];
  colors?: string[];
  positions?: ('random' | 'scattered')[];
}

const FloatingShapes = memo(({ 
  count = 12, 
  sizes = ['small', 'medium', 'large'],
  colors = [
    'from-pink-400 to-purple-600',
    'from-blue-400 to-cyan-600',
    'from-orange-400 to-yellow-600',
    'from-green-400 to-emerald-600',
    'from-purple-400 to-indigo-600',
    'from-red-400 to-pink-600',
    'from-cyan-400 to-blue-600',
    'from-yellow-400 to-orange-600'
  ],
  positions = ['random']
}: FloatingShapesProps) => {
  
  const shapes = ['circle', 'triangle', 'square', 'polygon'];
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6', 
    large: 'w-8 h-8'
  };

  const animationClasses = [
    'animate-float-slow',
    'animate-float-medium', 
    'animate-float-fast',
    'animate-bounce-slow'
  ];

  const generateShapes = () => {
    return Array.from({ length: count }, (_, i) => {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const colorGradient = colors[Math.floor(Math.random() * colors.length)];
      const animation = animationClasses[Math.floor(Math.random() * animationClasses.length)];
      
      // Random position within hero area
      const top = Math.floor(Math.random() * 80) + 10; // 10% to 90%
      const left = Math.floor(Math.random() * 80) + 10; // 10% to 90%
      const rotation = Math.floor(Math.random() * 360);
      const delay = Math.floor(Math.random() * 20); // 0-20s delay
      
      const baseClasses = `absolute ${sizeClasses[size]} bg-gradient-to-br ${colorGradient} opacity-70 pointer-events-none ${animation}`;
      
      let shapeSpecificStyles: any = {
        top: `${top}%`,
        left: `${left}%`,
        animationDelay: `${delay}s`,
        zIndex: 1
      };

      switch (shape) {
        case 'circle':
          return (
            <div
              key={`circle-${i}`}
              className={`${baseClasses} rounded-full`}
              style={shapeSpecificStyles}
            />
          );
        case 'triangle':
          shapeSpecificStyles.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
          shapeSpecificStyles.transform = `rotate(${rotation}deg)`;
          return (
            <div
              key={`triangle-${i}`}
              className={baseClasses}
              style={shapeSpecificStyles}
            />
          );
        case 'square':
          shapeSpecificStyles.transform = `rotate(${rotation}deg)`;
          return (
            <div
              key={`square-${i}`}
              className={baseClasses}
              style={shapeSpecificStyles}
            />
          );
        case 'polygon':
          shapeSpecificStyles.clipPath = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
          shapeSpecificStyles.transform = `rotate(${rotation}deg)`;
          return (
            <div
              key={`polygon-${i}`}
              className={baseClasses}
              style={shapeSpecificStyles}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block" style={{ zIndex: 1 }}>
      {generateShapes()}
    </div>
  );
});

FloatingShapes.displayName = 'FloatingShapes';

export default FloatingShapes;