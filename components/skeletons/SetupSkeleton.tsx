import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SetupSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardHeader className="text-center space-y-4">
                    <Skeleton className="mx-auto w-16 h-16 rounded-2xl" />
                    <div className="space-y-2 flex flex-col items-center">
                        <Skeleton className="h-10 w-64 md:w-96" />
                        <Skeleton className="h-5 w-80 md:w-[500px]" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Form fields skeleton */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-8">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
