import { Toaster } from "@/components/ui/toaster";
import { UserContextProvider } from "./context/user-context";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-black`}>
        <UserContextProvider>
          {children}
          <Toaster />
        </UserContextProvider>
      </body>
    </html>
  );
}
