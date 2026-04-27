import { storage } from "@/lib/appwrite/client";
import { appwriteServerConfig } from "@/lib/appwrite/config";
import { ID } from "appwrite";
import type { WizardDraft } from "../hooks/use-wizard-draft";

export type UploadedIntakeDocument = {
	fieldId: string;
	fileId: string;
	fileName: string;
	fileSize: number;
	mimeType: string;
};

export async function uploadIntakeFiles(
	draft: WizardDraft,
): Promise<UploadedIntakeDocument[]> {
	const uploadedDocuments: UploadedIntakeDocument[] = [];

	for (const [fieldId, files] of Object.entries(draft.files)) {
		for (const file of files) {
			const uploadedFile = await storage.createFile(
				appwriteServerConfig.documentsBucketId,
				ID.unique(),
				file,
			);

			uploadedDocuments.push({
				fieldId,
				fileId: uploadedFile.$id,
				fileName: file.name,
				fileSize: file.size,
				mimeType: file.type,
			});
		}
	}

	return uploadedDocuments;
}
