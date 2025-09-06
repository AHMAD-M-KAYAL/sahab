import { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Stack,
  Divider,
  Tooltip,
  Chip,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import IconBack from "../../assets/logo/back.svg";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

const ContactUs = () => {
  const userName = localStorage.getItem("userName") ?? "";
  const userPhone = localStorage.getItem("userPhone") ?? "";
  const userEmail = localStorage.getItem("email") ?? "";

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX = 500;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      await new Promise((r) => setTimeout(r, 900)); // محاكاة طلب
      setSuccess(true);
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* شريط علوي بسيط مع زر رجوع */}
      <nav
        className="navbar"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
        }}
      >
        <Box
          component={Button}
          onClick={() => navigate("/Account")}
          sx={{
            width: "10%",
            backgroundColor: "white",
            "&:hover": { transform: "translateY(1px) scale(1.201)" },
          }}
        >
          <Box component="img" src={IconBack} />
        </Box>
      </nav>

      {/* خلفية متدرّجة + زخرفة */}
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #eef2ff 0%, #f8fafc 35%, #fefefe 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* فقاعات خفيفة للزخرفة */}
        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, #93c5fd 0%, transparent 70%)",
            top: -60,
            right: -40,
            opacity: 0.25,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, #a7f3d0 0%, transparent 70%)",
            bottom: -60,
            left: -40,
            opacity: 0.25,
          }}
        />

        <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              backdropFilter: "blur(8px)",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            {/* رأس البطاقة */}
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <MailOutlineIcon />
                </Avatar>
              }
              title="Contact Us"
              subheader="We’d love to hear from you"
              sx={{
                "& .MuiCardHeader-title": {
                  fontWeight: 700,
                  fontSize: 22,
                },
                "& .MuiCardHeader-subheader": {
                  color: "text.secondary",
                },
              }}
            />

            <Divider />

            {/* بيانات المستخدم للعرض */}
            <CardContent sx={{ pt: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Chip
                  icon={<PersonOutlineIcon />}
                  label={userName || "Guest"}
                  variant="outlined"
                />
                <Chip
                  icon={<PhoneIphoneIcon />}
                  label={userPhone || "—"}
                  variant="outlined"
                />
                <Chip
                  icon={<AlternateEmailIcon />}
                  label={userEmail || "—"}
                  variant="outlined"
                />
              </Stack>

              {/* النموذج */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "grid", gap: 2 }}
              >
                <TextField
                  label="Write your message"
                  placeholder="Type your message here..."
                  multiline
                  rows={7}
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  inputProps={{ maxLength: MAX }}
                />

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Tooltip title="Maximum characters">
                    <Chip
                      size="small"
                      label={`${message.length}/${MAX}`}
                      sx={{ borderRadius: 2 }}
                    />
                  </Tooltip>

                  <Stack direction="row" spacing={1}>
                    <Button
                      type="button"
                      variant="text"
                      onClick={() => setMessage("")}
                      disabled={!message}
                      sx={{ textTransform: "none" }}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!message.trim() || sending}
                      sx={{
                        px: 3,
                        height: 44,
                        borderRadius: 2,
                        textTransform: "none",
                        background:
                          "linear-gradient(135deg, var(--main-color, #1976d2), #2563eb)",
                        boxShadow: "0 6px 16px rgba(37,99,235,0.25)",
                      }}
                    >
                      {sending ? "Sending..." : "Send message"}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* إشعارات */}
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          Message has been sent successfully 🎉
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactUs;
