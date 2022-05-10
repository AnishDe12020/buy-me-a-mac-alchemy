import { createTheme, NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import React from "react";

const theme = createTheme({ type: "dark" });

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider theme={theme}>
      <Component {...pageProps} />
      <Toaster
        toastOptions={{
          style: { color: "#ffffff", background: "#333333" },
          position: "bottom-right",
        }}
      />
    </NextUIProvider>
  );
}

export default MyApp;
