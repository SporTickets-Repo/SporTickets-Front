import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventPageSkeleton() {
  return (
    <div className="container animate-pulse">
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="h-[30vh] w-full rounded-xl" />

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-4 space-y-2">
                <Skeleton className="h-7 w-full mb-2" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              <div>
                <Skeleton className="w-full h-[200px] rounded-lg" />
                <Skeleton className="h-4 w-1/3 mt-2" />
                <Skeleton className="h-4 w-1/4 mt-1" />
              </div>
              <div className="bg-zinc-50 p-4 rounded-lg space-y-4 h-[200px]">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="bg-zinc-50 p-4 rounded-lg space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              <div className="bg-zinc-50 p-4 rounded-lg space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-1 space-y-4">
              {[1, 2].map((_, index) => (
                <Card key={index} className="bg-zinc-100 p-4 rounded-lg">
                  <CardContent className="p-0 flex flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-[40px]" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                    <Skeleton className="h-8 w-[80px]" />
                  </CardContent>
                </Card>
              ))}
              <Card className="bg-zinc-100 p-3 rounded-lg">
                <CardContent className="space-y-2 p-0">
                  <div className="flex items-center gap-2 justify-between">
                    <Skeleton className="h-6 w-[90px]" />
                    <Skeleton className="h-6 w-[40px]" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
