import Box from "@mui/material/Box";

const StatsCards = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr 1fr",
        },
        gap: 2,
        p: 2,
      }}
    >
      {/* Upcoming Reservations */}
      <Box
        sx={{
          bgcolor: "#3b82f6", // أزرق
          borderRadius: "10px",
          p: 3,
          textAlign: "center",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <Box sx={{ fontSize: "28px", fontWeight: 700 }}>65</Box>
        <Box sx={{ fontSize: "16px", fontWeight: 400 }}>
          Upcoming Reservations
        </Box>
      </Box>

      {/* Total Reservations */}
      <Box
        sx={{
          bgcolor: "#facc15", // أصفر
          borderRadius: "10px",
          p: 3,
          textAlign: "center",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <Box sx={{ fontSize: "28px", fontWeight: 700 }}>71</Box>
        <Box sx={{ fontSize: "16px", fontWeight: 400 }}>Total Reservations</Box>
      </Box>

      {/* Daily Sales */}
      <Box
        sx={{
          bgcolor: "#22c55e", // أخضر
          borderRadius: "10px",
          p: 3,
          textAlign: "center",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <Box sx={{ fontSize: "28px", fontWeight: 700 }}>950</Box>
        <Box sx={{ fontSize: "16px", fontWeight: 400 }}>Daily Sales (KD)</Box>
      </Box>

      {/* Monthly Sales */}
      <Box
        sx={{
          bgcolor: "#a855f7", // بنفسجي
          borderRadius: "10px",
          p: 3,
          textAlign: "center",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <Box sx={{ fontSize: "28px", fontWeight: 700 }}>71</Box>
        <Box sx={{ fontSize: "16px", fontWeight: 400 }}>Monthly Sales</Box>
      </Box>
    </Box>
  );
};

export default StatsCards;
