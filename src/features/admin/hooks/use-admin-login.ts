import { useMutation } from "@tanstack/react-query";
import { adminLogin } from "../services/admin-login";

export function useAdminLogin() {
	return useMutation({
		mutationFn: adminLogin,
	});
}
