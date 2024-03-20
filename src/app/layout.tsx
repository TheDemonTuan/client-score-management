import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Provider from "@/components/provider";

const roboto = Roboto({ weight: ["100", "300", "400", "500", "700", "900"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "T&Đ Score Manager",
  description: "Quản lý điểm của sinh viên",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Provider>{children}</Provider>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
