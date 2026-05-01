import { Suspense } from "react";
import type { Metadata } from "next";
import { Box, CircularProgress } from "@mui/material";
import VerifyEmailPageContent from "@/pages/auth/VerifyEmailPage";

export const metadata: Metadata = { title: "Verify Email" };

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      }
    >
      <VerifyEmailPageContent />
    </Suspense>
  );
}
