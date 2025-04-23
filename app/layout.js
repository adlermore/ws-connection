import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import { Providers } from "../redux/providers";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.scss";

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { JsonContextProvider } from "@/context/jsonContext";

export const metadata = {
  title: "Gold Center",
  description: "Gold Center Fixing",
};

export default async function RootLayout({ children }) {

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <JsonContextProvider>
      <html lang={locale}>
        <body className="flex flex-col siteBody ">
          <NextIntlClientProvider messages={messages}>
            <Toaster containerStyle={{ zIndex: 9999 }} position="bottom-right" />
            <Providers>
              <Header />
              <div className="flex-1 main-wrapper">{children}</div>
              <Footer />
            </Providers>
          </NextIntlClientProvider>
        </body>
      </html>
    </JsonContextProvider>
  );
}
