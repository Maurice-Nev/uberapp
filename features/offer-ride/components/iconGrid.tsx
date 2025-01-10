import React from "react";
import {
  Car,
  User,
  Users,
  MapPin,
  MessageCircle,
  Calendar,
  Phone,
  Shield,
  Clock,
  Smile,
  Home,
  Route,
  Compass,
  CheckCircle,
  AlertTriangle,
  Navigation,
  ThumbsUp,
  Search,
  Flag,
} from "lucide-react";

const icons = [
  Car,
  User,
  Users,
  MapPin,
  MessageCircle,
  Calendar,
  Phone,
  Shield,
  Clock,
  Smile,
  Home,
  Route,
  Compass,
  CheckCircle,
  AlertTriangle,
  Navigation,
  ThumbsUp,
  Search,
  Flag,
];

const IconGrid = () => {
  const grid = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => null)
  );
  const randomIconGrid = grid.map((row) =>
    row.map(() =>
      Math.random() > 0.6
        ? icons[Math.floor(Math.random() * icons.length)]
        : null
    )
  );

  return (
    <div className="grid h-full w-full grid-cols-10 gap-2 p-4">
      {randomIconGrid.flatMap((row, rowIndex) =>
        row.map((Icon, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="w-8 h-8 flex items-center justify-center"
          >
            {Icon && (
              <Icon className="text-gray-500 opacity-70  w-full h-full hover:text-primary hover:opacity-100 hover:scale-125 transition-transform duration-200" />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default IconGrid;
