import type { Models } from "node-appwrite";

export function isAdminUser(user: Models.User<Models.Preferences>) {
	return user.labels?.includes("Admin");
}

export function isClientUser(user: Models.User<Models.Preferences>) {
	return !isAdminUser(user);
}
