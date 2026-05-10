export type DashboardCaseStatus =
	| "pending_documents"
	| "draft"
	| "submitted"
	| "uploaded"
	| "in_review"
	| "requires_changes"
	| "completed";

export type DashboardData = {
	profile: {
		fullName: string;
		email: string;
	};
	case: {
		id: string;
		status: DashboardCaseStatus;
		progress: number;
		uploadedDocumentsCount: number;
		pendingTasks: string[];
		submittedAt: string | null;
		hasSubmittedDocuments: boolean;
	} | null;
};
