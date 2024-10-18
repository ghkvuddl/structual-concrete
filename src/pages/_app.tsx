import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <div id="body">
        <Component {...pageProps} />
      </div>
    </ChakraProvider>
  );
}
