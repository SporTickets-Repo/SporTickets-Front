import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="min-h-screen ">
      <div className="flex flex-col min-h-[90vh] relative z-40 text-white bg-black/80 mb-5">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-zinc-700/20 via-zinc-900/80 to-black -z-10" />
        <div className="flex flex-1 flex-col justify-center items-center md:max-w-4xl text-black gap-2 container mt-48 mb-24">
          <div className="relative w-full mt-[-16px]">
            <Skeleton className="h-[51px]  rounded-md md:min-w-[450px] bg-gray-300/20" />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-[165px] h-[64px] rounded-lg bg-gray-300/20"
              />
            ))}
          </div>
        </div>
        <div className="container space-y-4 mb-5">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48 bg-gray-300/20" />
            <Skeleton className="h-8 w-8 rounded-md bg-gray-300/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden bg-transparent border-0 shadow-none"
              >
                <Skeleton className="w-full h-44 rounded-lg bg-gray-300/20" />
                <CardContent className="p-3 space-y-1">
                  <Skeleton className="w-3/4 h-6 mb-1 bg-gray-300/20" />
                  <Skeleton className="w-1/2 h-4 bg-gray-300/20" />
                  <Skeleton className="w-1/3 h-4 bg-gray-300/20" />
                  <Skeleton className="w-3/4 h-4 bg-gray-300/20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="container space-y-10 mb-10">
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden bg-transparent border-0 shadow-none"
                >
                  <Skeleton className="w-full h-44 rounded-lg" />
                  <CardContent className="p-3 space-y-1">
                    <Skeleton className="w-3/4 h-6 mb-1" />
                    <Skeleton className="w-1/2 h-4" />
                    <Skeleton className="w-1/3 h-4" />
                    <Skeleton className="w-3/4 h-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
