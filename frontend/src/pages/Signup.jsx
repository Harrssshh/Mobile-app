import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link as MuiLink,
  Container,
  Alert,
  Snackbar,
} from "@mui/material";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
    autoHide: 3000,
  });
  const navigate = useNavigate();

  // Use Vite env var when deployed, fallback to localhost for dev
  const API_URL = import.meta.env.VITE_API_URL || "https://mobile-app-rb5q.onrender.com";

  const showMessage = (message, severity = "success", autoHide = 3000) => {
    setToast({ open: true, message, severity, autoHide });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showMessage("Passwords do not match. Please try again.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters long.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        data = null;
      }

      if (!res.ok) {
        const msg = data?.message || data?.error || "Signup failed";
        showMessage(msg, "error");
        setIsLoading(false);
        return;
      }

      if (!data?.token || !data?.user) {
        showMessage("Invalid response from server", "error");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      showMessage("Account created — redirecting...", "success", 1500);
      setIsLoading(false);

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      console.error("Signup error:", err);
      showMessage("Network error — please try again", "error");
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Create an account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Get started with your new account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  variant="outlined"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  sx={{ py: 1.5 }}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <MuiLink component={Link} to="/login" fontWeight="medium" sx={{ textDecoration: "none" }}>
                  Sign in
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={toast.autoHide}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled" onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;
