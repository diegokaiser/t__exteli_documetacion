import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewDocumentItem } from "@/features/intake/components/review-document-item";
import type { ReviewSectionData } from "@/features/intake/utils/review-mappers";

export function ReviewSection({ section }: { section: ReviewSectionData }) {
	return (
		<Card className="rounded-3xl border-0 shadow-lg">
			<CardHeader className="pb-3">
				<CardTitle className="text-lg">{section.title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{section.items.map((item) => (
					<ReviewDocumentItem key={item.id} item={item} />
				))}
			</CardContent>
		</Card>
	);
}
