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
      className={`bg-white/10 text-white border-0 backdrop-blur ${className} cursor-pointer hover:bg-white/20 `}
    >
      <CardContent className="flex items-center justify-center py-4 md:py-8 px-0">
        <Icon size={24} />
        <h3 className="font-bold ml-2 text-sm sm:text-base">{title}</h3>
      </CardContent>
    </Card>
  );
}
