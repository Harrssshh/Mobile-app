import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/dashboard"); 
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", px: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Welcome to Mobile App
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 5, maxWidth: 600, mx: "auto" }}
          >
            Manage your projects efficiently with our beautiful
            task management system
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Sign in
            </Button>

            <Button
              component={Link}
              to="/signup"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Create account
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Index;
