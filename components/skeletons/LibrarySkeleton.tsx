import { Skeleton } from "@/components/ui/skeleton"
import { HeaderSkeleton } from "./HeaderSkeleton"

export function LibrarySkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex flex-col">
            <div className="flex-1">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                    <HeaderSkeleton />

                    {/* Page Header */}
                    <div className="relative py-8 px-6 space-y-6">
                        <Skeleton className="h-10 w-24" /> {/* Back Button */}
                        <div className="space-y-4 flex flex-col items-center">
                            <Skeleton className="h-10 w-48 md:w-64" />
                            <Skeleton className="h-5 w-64 md:w-96" />
                        </div>
                    </div>

                    {/* Library Grid */}
                    <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                                    <Skeleton className="aspect-square rounded-xl w-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-8 w-full rounded-md" />
                                        <Skeleton className="h-8 w-10 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
