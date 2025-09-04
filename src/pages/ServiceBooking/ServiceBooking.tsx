import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate, useParams } from "react-router-dom";

export default function ServiceBooking() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");

  const { id } = useParams()

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
  ];

  const isFormValid = Boolean(selectedDate && selectedTime && address.trim());
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc, #eef2f6)",
      }}
    >
      {/* Sticky header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          bgcolor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(6px)",
          borderBottom: 1,
          borderColor: "divider",
          boxShadow: 1,
        }}
      >
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
          size="small"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Book Your Service
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Grid container spacing={1}>
          {/* Booking Date */}
          <Grid xs={12} lg={6} container>
            <Card
              variant="outlined"
              sx={{
                margin: "10px",
                width: "100%",
                border: 0,
                boxShadow: 6,
                bgcolor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(6px)",
                transition: (t) => t.transitions.create("box-shadow"),
                "&:hover": { boxShadow: 10 },
              }}
            >
              <CardHeader
                sx={{ pb: 1.5 }}
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{ p: 1, bgcolor: "primary.light", borderRadius: 2 }}
                    >
                      <CalendarMonthIcon
                        sx={{ color: "primary.main", fontSize: 20 }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      Booking Date
                    </Typography>
                  </Box>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Choose your preferred date for the service appointment.
                  </Typography>
                }
              />
              <CardContent sx={{ display: "grid", gap: 1.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  Select Date{" "}
                  <Box component="span" sx={{ color: "error.main" }}>
                    *
                  </Box>
                </Typography>
                <TextField
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: selectedDate ? (
                      <InputAdornment position="end">
                        <CheckCircleIcon color="success" fontSize="small" />
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Time */}
          <Grid xs={12} lg={6} container>
            <Card
              variant="outlined"
              sx={{
                margin: "10px",
                width: "100%",
                border: 0,
                boxShadow: 6,
                bgcolor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(6px)",
                transition: (t) => t.transitions.create("box-shadow"),
                "&:hover": { boxShadow: 10 },
              }}
            >
              <CardHeader
                sx={{ pb: 1.5 }}
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: selectedDate
                          ? "success.light"
                          : "action.hover",
                      }}
                    >
                      <AccessTimeIcon
                        sx={{
                          color: selectedDate
                            ? "success.main"
                            : "text.disabled",
                          fontSize: 20,
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      Booking Time
                    </Typography>
                  </Box>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Select your preferred time slot for the appointment.
                  </Typography>
                }
              />
              <CardContent sx={{ display: "grid", gap: 1.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  Select Time{" "}
                  <Box component="span" sx={{ color: "error.main" }}>
                    *
                  </Box>
                </Typography>

                {!selectedDate ? (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "action.hover",
                      borderRadius: 3,
                      border: "2px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ fontSize: 36, color: "text.disabled", mb: 1 }}
                    />
                    <Typography fontWeight={600} color="text.secondary">
                      Please select a date first
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Time slots will appear after date selection
                    </Typography>
                  </Box>
                ) : (
                  <TextField
                    select
                    fullWidth
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    placeholder="Choose your time slot"
                    InputProps={{
                      endAdornment: selectedTime ? (
                        <InputAdornment position="end">
                          <CheckCircleIcon color="success" fontSize="small" />
                        </InputAdornment>
                      ) : undefined,
                    }}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time} sx={{ py: 1.2 }}>
                        {time}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Service Address */}
          <Grid xs={12} container>
            <Card
              variant="outlined"
              sx={{
                margin: "10px",
                width: "100%",
                border: 0,
                boxShadow: 6,
                bgcolor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(6px)",
                transition: (t) => t.transitions.create("box-shadow"),
                "&:hover": { boxShadow: 10 },
              }}
            >
              <CardHeader
                sx={{ pb: 1.5 }}
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: address ? "secondary.light" : "action.hover",
                      }}
                    >
                      <PlaceIcon
                        sx={{
                          color: address ? "secondary.main" : "text.disabled",
                          fontSize: 20,
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      Service Address
                    </Typography>
                  </Box>
                }
              />
              <CardContent sx={{ display: "grid", gap: 1.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  Enter Your Address{" "}
                  <Box component="span" sx={{ color: "error.main" }}>
                    *
                  </Box>
                </Typography>

                <TextField
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete address"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {address ? (
                          <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                          <PlaceIcon
                            sx={{ color: "text.disabled" }}
                            fontSize="small"
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />

                {address && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "primary.50",
                      borderRadius: 3,
                      border: 1,
                      borderColor: "primary.200",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                      }}
                    >
                      <PlaceIcon
                        sx={{ color: "primary.main", fontSize: 18, mt: "2px" }}
                      />
                      <Typography variant="body2" color="primary.dark">
                        Muntazah Al Khairan road 278 zone 3, An Nami, Al Khiran,
                        Kuwait
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Totals + CTA */}
        <Box sx={{ maxWidth: "100%", mx: "auto", display: "grid", gap: 2.5 }}>
          <Card
            elevation={8}
            sx={{
              color: "common.white",
              backgroundImage: "linear-gradient(90deg, #0b1220, #141b2f)",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                    fontWeight={600}
                  >
                    Total Amount
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    30.000 KD
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    Service Fee Included
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Button
            fullWidth
            size="large"
            disabled={!isFormValid}
            onClick={()=> navigate(`/services/book/${id}/checkout`)}
            sx={{
              height: 56,
              fontSize: 18,
              fontWeight: 800,
              borderRadius: 3,
              color: isFormValid ? "common.white" : "text.disabled",
              backgroundImage: isFormValid
                ? "linear-gradient(90deg, #2563eb, #1d4ed8)"
                : "none",
              bgcolor: isFormValid
                ? "transparent"
                : "action.disabledBackground",
              boxShadow: isFormValid ? 6 : "none",
              transition: (t) =>
                t.transitions.create(
                  ["transform", "box-shadow", "background-color"],
                  {
                    duration: t.transitions.duration.short,
                  }
                ),
              "&:hover": {
                transform: isFormValid ? "translateY(-2px)" : "none",
                boxShadow: isFormValid ? 10 : "none",
                backgroundImage: isFormValid
                  ? "linear-gradient(90deg, #1d4ed8, #1e40af)"
                  : "none",
              },
            }}
          >
            {isFormValid ? "Proceed to Checkout" : "Complete All Fields"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
