import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/utils/cn";

interface ReactionButtonProps {
  initialCount: number;
  onReact: () => void;
}

export function ReactionButton({ initialCount, onReact }: ReactionButtonProps) {
  const [count, setCount] = useState(initialCount);

  const handleClick = () => {
    setCount(count + 1);
    onReact();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="flex items-center space-x-0.5 p-0 text-muted-foreground hover:text-muted-foreground hover:bg-transparent group"
    >
      <Heart
        className={cn(
          "w-6 h-6 transition-colors",
          count > initialCount
            ? "text-red-500 fill-red-500"
            : "group-hover:text-red-500 group-hover:stroke-red-500"
        )}
      />
      <span>{count}</span>
    </Button>
  );
}
