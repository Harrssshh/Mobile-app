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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: "success", message: "" });
  const navigate = useNavigate();

  const showMessage = (message, severity = "success", autoHide = 3000) => {
    setToast({ open: true, severity, message, autoHide });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        data = null;
      }

      if (!res.ok) {
        const msg = data?.message || data?.error || "Login failed";
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

      showMessage("Login successful! Redirecting...", "success");
      setIsLoading(false);

      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      console.error("Login error:", err);
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
                Welcome back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your account to continue
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                />

                <Box sx={{ textAlign: "right" }}>
                  <MuiLink
                    component={Link}
                    to="/forgot-password"
                    variant="body2"
                    sx={{ textDecoration: "none" }}
                  >
                    Forgot password?
                  </MuiLink>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  sx={{ py: 1.5 }}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <MuiLink
                  component={Link}
                  to="/signup"
                  fontWeight="medium"
                  sx={{ textDecoration: "none" }}
                >
                  Sign up
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={toast.autoHide || 3000}
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

export default Login;
