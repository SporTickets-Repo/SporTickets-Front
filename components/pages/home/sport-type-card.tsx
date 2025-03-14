import { Card, CardContent } from "@/components/ui/card";

interface SportTypeCardProps {
  Icon: React.FC;
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
      className={`bg-[#1E211B] text-white border border-[#1E211B] ${className}`}
    >
      <CardContent className="flex items-center justify-center p-6 sm:p-8">
        <Icon />
        <h3 className="font-bold ml-2 text-sm sm:text-base">{title}</h3>
      </CardContent>
    </Card>
  );
}
