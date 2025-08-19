import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Visit } from "../../types/visit";
import { VisitService } from "../../services/visitService";

export const useCancelVisitHook = () => {
    const [canceledVisit, setCanceledVisit] = useState<Visit | null>(null);
    const [loading, setLoading] = useState(false);

    const cancelVisit = useCallback(async (visitId: number): Promise<Visit | null> => {
        setLoading(true);
        try {
            const canceled = await VisitService.cancelVisit(visitId);
            if (canceled) {
                setCanceledVisit(canceled);
                toast.success("Visit canceled successfully");
                return canceled;
            }
            return null;
        } catch (error) {
            console.error("Error canceling visit:", error);
            toast.error("Failed to cancel visit");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { cancelVisit, canceledVisit, loading };
};