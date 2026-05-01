import { Suspense } from "react";
import type { Metadata } from "next";
import { Box, CircularProgress } from "@mui/material";
import ResetPasswordPageContent from "@/pages/auth/ResetPasswordPage";

export const metadata: Metadata = { title: "Set New Password" };

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}
