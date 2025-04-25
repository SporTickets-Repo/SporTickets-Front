import { Card, CardContent } from "@/components/ui/card";
import { IconType } from "react-icons";

interface SportTypeCardProps {
  Icon: IconType;
  title: string;
  className?: string;
}

export default function SportTypeCard({
  Icon,
  title,
  className,
}: SportTypeCardProps) {
  return (
    <Card
      className={`bg-white/10 text-white/90 border-0 backdrop-blur ${className} cursor-pointer hover:bg-white/20 `}
    >
      <CardContent className="flex flex-col items-center justify-center py-2 gap-1 px-0">
        <Icon size={20} />
        <h3 className="text-sm md:text-base">{title}</h3>
      </CardContent>
    </Card>
  );
}
