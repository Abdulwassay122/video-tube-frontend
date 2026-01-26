"use client";

import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import React, { ChangeEvent, useRef, useState } from "react";
import { Fullscreen, Visibility, VisibilityOff } from "@mui/icons-material";
import Spinner from "./assets/Iphone-spinner-2.gif";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import { apiRequest } from "@/utils/apiRequest";

type FormData = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: File | null;
  coverImage?: File | null;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<String>("");

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    coverImage: null,
  });

  const [showPass, setShowPass] = useState<boolean>(false);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "avatar" | "coverImage"
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.files![0],
      }));
    }
  };

  // for validation
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  function validateForm(formData: FormData) {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full Name must be at least 3 characters.";
    }

    if (!formData.username || formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.avatar) {
      newErrors.avatar = "Please select an avatar image.";
    }

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
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("username", formData.username);
      form.append("password", formData.password);

      if (formData.avatar) form.append("avatar", formData.avatar);
      if (formData.coverImage) form.append("coverImage", formData.coverImage);

      // Using apiRequest with isFormData = true
      const res = await apiRequest(
        "POST",
        `${apiUrl}/api/v1/users/register`,
        form
      );

      toast.success(res.message);
      console.log("User:", res.data);
    } catch (error: any) {
      // ERROR → EXACT backend message
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

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
          width: "80%",
          p: 4,
          my: 5,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Register
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
          label="Full Name"
          type="text"
          name="fullName"
          size="small"
          margin="normal"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />
        {errors.fullName && (
          <Typography
            color="error"
            fontSize={12}
            sx={{ mt: -1, mb: 1, textAlign: "right" }}
          >
            {errors.fullName}
          </Typography>
        )}

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

        <TextField
          fullWidth
          label="Username"
          type="text"
          name="username"
          size="small"
          margin="normal"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
        />
        {errors.username && (
          <Typography
            color="error"
            fontSize={12}
            sx={{ mt: -1, mb: 1, textAlign: "right" }}
          >
            {errors.username}
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

        <TextField
          fullWidth
          label="Confirm password"
          type={showPass ? "text" : "password"}
          name="confirmPassword"
          size="small"
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm password"
        />
        {errors.confirmPassword && (
          <Typography
            color="error"
            fontSize={12}
            sx={{ mt: -1, mb: 1, textAlign: "right" }}
          >
            {errors.confirmPassword}
          </Typography>
        )}

        {/* Avatar File Input */}
        <Typography
          fontSize={14}
          fontWeight={500}
          mt={2}
          mb={1}
          textAlign="left"
        >
          Avatar
        </Typography>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*" // Only images
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const img = new window.Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
              if (img.width !== img.height) {
                // alert("Please select a square image (1:1 ratio).");
                setErrors((prev) => ({
                  ...prev,
                  avatar: "Please select a square image (1:1 ratio).",
                }));
                e.target.value = ""; // reset input
                return;
              }
              setFormData((prev) => ({ ...prev, avatar: file }));
            };
          }}
        />
        <Box
          onClick={() => avatarInputRef.current?.click()}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #C5C5C5",
            borderRadius: 2,
            padding: 3,
            cursor: "pointer",
            minHeight: 150,
            textAlign: "center",
            "&:hover": { borderColor: "#888" },
          }}
        >
          {formData.avatar ? (
            <Box
              component="img"
              src={URL.createObjectURL(formData.avatar)}
              alt="avatar preview"
              sx={{
                width: 100,
                height: 100,
                borderRadius: 2,
                mb: 1,
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography fontSize={14} color="text.secondary">
              Click to upload a square avatar
            </Typography>
          )}

          <Button variant="outlined" size="small">
            Browse
          </Button>
        </Box>
        {errors.avatar && (
          <Typography
            color="error"
            fontSize={12}
            sx={{ mt: 1, mb: 1, textAlign: "right" }}
          >
            {errors.avatar}
          </Typography>
        )}

        {/* Cover Image File Input */}
        <Typography
          fontSize={14}
          fontWeight={500}
          mt={2}
          mb={1}
          textAlign="left"
        >
          Cover Image (optional)
        </Typography>

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*" // Only images
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const img = new window.Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
              const ratio = img.width / img.height;
              if (Math.abs(ratio - 3) > 0.01) {
                // alert(
                //   "Please select an image with a 3:1 ratio (width:height)."
                // );
                setErrors((prev) => ({
                  ...prev,
                  coverImage:
                    "Please select an image with a 3:1 ratio (width:height).",
                }));
                e.target.value = ""; // reset input
                return;
              }
              setFormData((prev) => ({ ...prev, coverImage: file }));
            };
          }}
        />
        <Box
          onClick={() => coverInputRef.current?.click()}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #C5C5C5",
            borderRadius: 2,
            padding: 3,
            cursor: "pointer",
            minHeight: 100,
            textAlign: "center",
            "&:hover": { borderColor: "#888" },
          }}
        >
          {formData.coverImage ? (
            <Box
              component="img"
              src={URL.createObjectURL(formData.coverImage)}
              alt="cover Image preview"
              sx={{
                width: "100%", // full width of box
                maxWidth: 300, // optional max width
                height: "auto",
                borderRadius: 1,
                mb: 1,
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography fontSize={14} color="text.secondary">
              Click to upload a cover image with ratio 3:1
            </Typography>
          )}

          <Button variant="outlined" size="small">
            Browse
          </Button>
        </Box>
        {errors.coverImage && (
          <Typography
            color="error"
            fontSize={12}
            sx={{ mt: 1, mb: 1, textAlign: "right" }}
          >
            {errors.coverImage}
          </Typography>
        )}

        {/* Buttons  */}
        <Box
          sx={{
            // display: "flex",
            gap: 2,
            mt: 2,
          }}
        >
          {/* Login Button */}
          <Button
            variant="contained"
            size="small"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
            onClick={submitForm}
          >
            Register
          </Button>

          {/* Register Button */}
          <Link href={"/user-login"}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, py: 1.2 }}
            >
              Login
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
