import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, BookOpen, Plane, Star } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  );
}

interface PulseButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function PulseButton({ children, onClick, className = '', variant = 'primary' }: PulseButtonProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 600);
    onClick?.();
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900'
  };

  return (
    <Button
      onClick={handleClick}
      className={`${variantClasses[variant]} ${className} transition-all duration-300 ${
        isPulsing ? 'animate-pulse scale-105' : ''
      }`}
    >
      {children}
    </Button>
  );
}

interface FloatingHeartProps {
  isActive: boolean;
  onAnimationEnd?: () => void;
}

export function FloatingHeart({ isActive, onAnimationEnd }: FloatingHeartProps) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onAnimationEnd?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onAnimationEnd]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <Heart 
        className="absolute top-1/2 left-1/2 w-8 h-8 text-red-500 fill-current animate-bounce"
        style={{
          animation: 'heartFloat 1s ease-out forwards',
          transform: 'translate(-50%, -50%)'
        }}
      />
      <style>{`
        @keyframes heartFloat {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -80px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -120px) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}

interface TypingIndicatorProps {
  isVisible: boolean;
  message?: string;
}

export function TypingIndicator({ isVisible, message = "Searching destinations" }: TypingIndicatorProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setDots('');
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm">{message}{dots}</span>
    </div>
  );
}

interface TransitionSlideProps {
  isVisible: boolean;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

export function TransitionSlide({ isVisible, children, direction = 'up', className = '' }: TransitionSlideProps) {
  const directionClasses = {
    left: isVisible ? 'translate-x-0' : '-translate-x-full',
    right: isVisible ? 'translate-x-0' : 'translate-x-full',
    up: isVisible ? 'translate-y-0' : 'translate-y-full',
    down: isVisible ? 'translate-y-0' : '-translate-y-full'
  };

  return (
    <div className={`transition-transform duration-500 ease-in-out ${directionClasses[direction]} ${className}`}>
      {children}
    </div>
  );
}

interface BookmarkAnimationProps {
  isBookmarked: boolean;
  onToggle: () => void;
}

export function BookmarkAnimation({ isBookmarked, onToggle }: BookmarkAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onToggle();
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-300 ${
        isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'
      } hover:scale-110 ${isAnimating ? 'animate-pulse' : ''}`}
    >
      <BookOpen className={`w-4 h-4 transition-transform duration-300 ${
        isAnimating ? 'scale-125' : ''
      }`} />
    </button>
  );
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ProgressRing({ progress, size = 60, strokeWidth = 4, color = '#3b82f6' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-gray-700">
        {Math.round(progress)}%
      </span>
    </div>
  );
}

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, onRatingChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly) {
      onRatingChange?.(starRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform duration-200`}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors duration-200 ${
              star <= (hoverRating || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export function SwipeCard({ children, onSwipeLeft, onSwipeRight, className = '' }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const offset = currentX - startX;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    if (dragOffset > 100) {
      onSwipeRight?.();
    } else if (dragOffset < -100) {
      onSwipeLeft?.();
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
  };

  return (
    <div
      className={`transition-transform duration-200 ${className}`}
      style={{
        transform: isDragging ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)` : 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </div>
  );
}

export default {
  LoadingSpinner,
  PulseButton,
  FloatingHeart,
  TypingIndicator,
  TransitionSlide,
  BookmarkAnimation,
  ProgressRing,
  StarRating,
  SwipeCard
};