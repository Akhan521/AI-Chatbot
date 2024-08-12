"use client";

import React from "react";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

function Page() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default Page;