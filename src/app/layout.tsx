import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import { Open_Sans, Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
	subsets: ["latin"],
	variable: "--font-body",
});

const openSans = Open_Sans({
	subsets: ["latin"],
	variable: "--font-heading",
});

export const metadata: Metadata = {
	title: "Portal documental",
	description: "Portal de gestión documental para clientes",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="es" className={`${roboto.variable} ${openSans.variable}`}>
			<body>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
