import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useResendClientInvite() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userId: string) => {
			const response = await fetch(
				`/api/admin/clients/${userId}/resend-invite`,
				{ method: "POST" },
			);

			if (!response.ok) {
				const error = await response.json().catch(() => null);
				throw new Error(error?.message ?? "No se pudo reenviar la invitación");
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "clients"] });
		},
	});
}
