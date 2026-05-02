import { Box, CircularProgress } from "@mui/material";

export default function GlobalLoading() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <CircularProgress size={48} />
    </Box>
  );
}
