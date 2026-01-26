import Sidebar from "@/components/Sidebar/Sidebar";
import MuiThemeProvider from "@/app/theme-provider";
import ToastProvider from "@/components/ToastProvider/ToastProvider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MuiThemeProvider>
          <ToastProvider />
          {children}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
