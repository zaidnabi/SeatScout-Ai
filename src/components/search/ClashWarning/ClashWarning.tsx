import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function ClashWarning() {
    return (
        <Card className="border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
            <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-red-900 dark:text-red-200">Exam Schedule Clash Detected</h3>
                    <p className="text-xs text-red-800 dark:text-red-300">
                        You have two papers scheduled in the same time session. Please report immediately to the examination department coordinator.
                    </p>
                </div>
            </div>
        </Card>
    );
}
