import { Skeleton } from "@/components/ui/skeleton"
import { HeaderSkeleton } from "./HeaderSkeleton"

export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex flex-col">
            <div className="flex-1">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                    <HeaderSkeleton />

                    {/* Welcome Section */}
                    <div className="relative py-14 px-6 space-y-6">
                        <div className="space-y-4 max-w-4xl mx-auto flex flex-col items-center">
                            <Skeleton className="h-12 w-3/4 md:w-1/2" />
                            <Skeleton className="h-6 w-full md:w-1/3" />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    </div>

                    {/* Analytics Section */}
                    <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-10 w-32" />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            <Skeleton className="h-[400px] rounded-xl" />
                            <Skeleton className="h-[400px] rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
