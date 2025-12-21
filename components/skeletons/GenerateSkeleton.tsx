import { Skeleton } from "@/components/ui/skeleton"
import { HeaderSkeleton } from "./HeaderSkeleton"

export function GenerateSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex flex-col">
            <div className="flex-1">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                    <HeaderSkeleton />

                    {/* Page Header */}
                    <div className="relative py-8 px-6 space-y-6">
                        <Skeleton className="h-10 w-24" /> {/* Back Button */}
                        <div className="space-y-4 flex flex-col items-center">
                            <Skeleton className="h-12 w-64 md:w-96" />
                            <Skeleton className="h-6 w-72 md:w-[500px]" />
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                        <div className="flex justify-between items-center max-w-3xl mx-auto">
                            <div className="flex flex-col items-center gap-2">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-1 flex-1 mx-4" />
                            <div className="flex flex-col items-center gap-2">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-1 flex-1 mx-4" />
                            <div className="flex flex-col items-center gap-2">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                        {/* Left Column */}
                        <div className="h-[600px] rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                            <div className="h-full flex flex-col gap-6">
                                <Skeleton className="w-full h-64 rounded-xl" /> {/* Image Upload Area */}
                                <Skeleton className="w-full h-12 rounded-lg" /> {/* Vibe Selector */}
                                <Skeleton className="w-full flex-1 rounded-xl" /> {/* Prompt/Controls */}
                            </div>
                        </div>
                        {/* Right Column */}
                        <div className="h-[600px] rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                            <div className="h-full flex flex-col gap-4">
                                <Skeleton className="w-full h-32 rounded-xl" />
                                <Skeleton className="w-full h-32 rounded-xl" />
                                <Skeleton className="w-full h-32 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
