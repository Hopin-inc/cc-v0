import { Card, CardContent } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedSkeleton() {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <Card key={index}>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-2 mb-4">
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
            <div className="grid grid-cols-3 gap-2 my-4">
              {[...Array(3)].map((_, photoIndex) => (
                <Skeleton
                  key={photoIndex}
                  className="aspect-square rounded-lg"
                />
              ))}
            </div>
            <div className="flex -space-x-2 my-4">
              {[...Array(3)].map((_, avatarIndex) => (
                <Skeleton
                  key={avatarIndex}
                  className="w-8 h-8 rounded-full border-2 border-background"
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-9 w-24" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
