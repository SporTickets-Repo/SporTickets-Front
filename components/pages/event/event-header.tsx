import Image from "next/image";

interface EventHeaderProps {
  alt: string;
  image: string;
}

export default function EventHeader({ alt, image }: EventHeaderProps) {
  return (
    <div className="overflow-hidden rounded-xl">
      <Image
        src={image}
        alt={alt}
        width={800}
        height={200}
        className="lg:h-[50vh] max-h-[50vh] w-full object-cover"
        unoptimized
        priority
      />
    </div>
  );
}
