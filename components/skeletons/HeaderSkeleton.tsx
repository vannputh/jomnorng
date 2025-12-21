import { Skeleton } from "@/components/ui/skeleton"

export function HeaderSkeleton() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-5 w-24 hidden sm:block" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-32 hidden sm:block" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                </div>
            </div>
        </header>
    )
}
