import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AuthSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 relative">
                <CardHeader className="text-center space-y-4">
                    <Skeleton className="absolute top-4 left-4 h-9 w-16" /> {/* Back button */}
                    <div className="mx-auto flex items-center justify-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <Skeleton className="h-9 w-32" />
                    </div>
                    <Skeleton className="h-4 w-48 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full rounded-md" /> {/* Tabs */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-3 pt-2">
                        <Skeleton className="h-10 w-full" /> {/* Button */}
                        <Skeleton className="h-10 w-full" /> {/* Google Button */}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
