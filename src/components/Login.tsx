"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Spinner from "./assets/Iphone-spinner-2.gif";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { apiRequest } from "@/utils/apiRequest";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const router = useRouter();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<String>("");

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  function validateForm(formData: FormData) {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // if (!formData.password || formData.password.length < 8) {
    //   newErrors.password = "Password must be at least 8 characters.";
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // true if no errors
  }

  async function submitForm() {
    setLoading(true);
    setErrors({});
    setError("");

    if (!validateForm(formData)) {
      setLoading(false);
      return;
    }

    try {
      // Use centralized apiRequest helper instead of axios directly
      const data = await apiRequest(
        "POST",
        `${apiUrl}/api/v1/users/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        router,
      );

      // SUCCESS: backend message and data exactly
      toast.success(data.message);
      router.push("/");
      console.log("User:", data.data);
    } catch (error: any) {
      // ERROR: backend message exactly
      const message = error?.message || "Something went wrong";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // async function handlerefresh() {
  //   try {
  //     // Use centralized apiRequest helper instead of axios directly
  //     const data = await apiRequest(
  //       "POST",
  //       `${apiUrl}/api/v1/users/refresh-token`,
  //       {
  //         email: formData.email,
  //         password: formData.password,
  //       },
  //       router
  //     );

  //     // SUCCESS: backend message and data exactly
  //     toast.success(data.message);
  //     console.log("User:", data.data);
  //   } catch (error: any) {
  //     // ERROR: backend message exactly
  //     const message = error?.message || "Something went wrong";
  //     toast.error(message);
  //     setError(message);
  //   }
  // }

  // async function handleLogout() {
  //   try {
  //     // Use centralized apiRequest helper instead of axios directly
  //     const data = await apiRequest(
  //       "POST",
  //       `${apiUrl}/api/v1/users/logout`,
  //       router
  //     );

  //     // SUCCESS: backend message and data exactly
  //     toast.success(data.message);
  //     console.log("User:", data.data);
  //   } catch (error: any) {
  //     // ERROR: backend message exactly
  //     const message = error?.message || "Something went wrong";
  //     toast.error(message);
  //     setError(message);
  //   }
  // }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: { sm: "80%" },
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Login
        </Typography>
        {error && (
          <Typography
            color="error"
            fontSize={14}
            sx={{ mx: 1, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        {loading && (
          <div className="flex justify-center">
            <Image height={50} width={50} alt="spinner" src={Spinner} />
          </div>
        )}

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          name="email"
          size="small"
          margin="normal"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />
        {errors.email && (
          <Typography
            color="error"
            fontSize={12}
            sx={{ mt: -1, mb: 1, textAlign: "right" }}
          >
            {errors.email}
          </Typography>
        )}

        {/* Password */}
        <TextField
          fullWidth
          label="Password"
          type={showPass ? "text" : "password"}
          name="password"
          size="small"
          margin="normal"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {errors.password && (
          <Typography
            color="error"
            fontSize={12}
            sx={{ mt: -1, mb: 1, textAlign: "right" }}
          >
            {errors.password}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column", // vertical stack
            gap: 2, // space between children
            mt: 2, // margin-top of the whole Box
          }}
        >
          {/* Login Button */}
          <Button
            variant="contained"
            size="small"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
            onClick={submitForm}
            className="mb-2"
          >
            Login
          </Button>
          {/* Register Button */}
          <Link
            href="/user-register"
            style={{ color: "#1976d2" }} // optional styling
          >
            Register User
          </Link>{" "}
          {/* <Button
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
            onClick={handlerefresh}
          >
            refresh
          </Button>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
            onClick={handleLogout}
          >
            Logout
          </Button> */}
        </Box>
      </Paper>
    </Container>
  );
}
