"use client";

import { Box, Button, Typography, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useRouter } from "next/navigation";

interface NotAuthenticatedProps {
  message?: string;
}

export default function NotAuthenticated({
  message = "Sign in to join the conversation and share your thoughts.",
}: NotAuthenticatedProps) {
  const router = useRouter();

  return (
    <section className="flex items-center justify-center min-h-[80vh] px-4">
      <Paper
        elevation={3}
        className="max-w-md w-full p-6 md:p-8 text-center rounded-2xl flex flex-col gap-2"
        sx={{background:"transparent", boxShadow:"none"}}
      >
        {/* Icon */}
        <Box className="flex justify-center mb-4">
          <Box className="bg-blue-100 p-4 rounded-full">
            <LockOutlinedIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          </Box>
        </Box>

        {/* Title */}
        <Typography variant="h6" className="font-semibold mb-2">
          You’re not signed in
        </Typography>

        {/* Message */}
        <Typography variant="body2" className="text-gray-600 mb-6">
          {message}
        </Typography>

        {/* Actions */}
        <Box className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push("/user-login")}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#155a9c" },
            }}
          >
            Login
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => router.push("/user-register")}
          >
            Create Account
          </Button>
        </Box>

        {/* Footer hint */}
        <Typography variant="caption" className="text-gray-400 mt-5 block">
          It only takes a few seconds
        </Typography>
      </Paper>
    </section>
  );
}
