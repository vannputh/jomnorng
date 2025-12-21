import { Skeleton } from "@/components/ui/skeleton"
import { HeaderSkeleton } from "./HeaderSkeleton"

export function LandingSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <HeaderSkeleton />
            <main className="max-w-6xl mx-auto px-4 py-24 md:py-32">
                <div className="text-center space-y-8">
                    <div className="space-y-6 flex flex-col items-center">
                        <Skeleton className="h-16 md:h-24 w-11/12 md:w-3/4" />
                        <Skeleton className="h-6 md:h-8 w-11/12 md:w-2/3" />
                    </div>

                    <div className="flex gap-4 justify-center pt-4">
                        <Skeleton className="h-14 w-48 rounded-md" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col items-center text-center space-y-4 p-6">
                                <Skeleton className="w-12 h-12 rounded-xl" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
