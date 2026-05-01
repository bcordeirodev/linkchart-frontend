import { Suspense } from "react";
import type { Metadata } from "next";
import { Box, CircularProgress } from "@mui/material";
import SignInPageContent from "@/pages/auth/SignInPage";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      }
    >
      <SignInPageContent />
    </Suspense>
  );
}
