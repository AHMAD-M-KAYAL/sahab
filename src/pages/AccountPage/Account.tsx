import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// أيقونات
import ArticleIcon from "@mui/icons-material/Article"; // Edit + My Posts
import EventSeatIcon from "@mui/icons-material/EventSeat"; // Reservations

export const Account = () => {
  // ستايل الأزرار
  const buttonSx = {
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "70px",
    border: "2px solid #e4e4e7",
    borderRadius: "10px",
    padding: "10px 15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: "20px",
    "&:hover": {
      backgroundColor: "#f3f4f6",
      borderColor: "#d1d5db",
      "& .arrowIcon": { color: "#000000" },
    },
  };

  // مربع الأيقونة
  const IconBox = ({ children }: { children: React.ReactNode }) => (
    <Avatar
      variant="rounded"
      sx={{
        bgcolor: "#e0f2ff", // أزرق فاتح
        width: 50,
        height: 50,
      }}
    >
      {children}
    </Avatar>
  );

  return (
    <Box
      sx={{
        padding: "10px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          fontWeight: "700",
          fontSize: "30px",
          color: "black",
          fontFamily: "sans-serif",
          marginBottom: "20px",
        }}
      >
        Account
      </Box>

      {/* Edit Account */}
      <Box component="button" sx={buttonSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <IconBox>
            <ArticleIcon sx={{ color: "#1976d2", fontSize: 28 }} />
          </IconBox>
          <Box sx={{ fontSize: "18px", fontWeight: 500, color: "#111827" }}>
            Edit Account
          </Box>
        </Box>
        <KeyboardArrowRightIcon
          fontSize="medium"
          className="arrowIcon"
          sx={{ color: "#c5c5c7ff", transition: "color 0.3s ease" }}
        />
      </Box>

      {/* My Posts */}
      <Box component="button" sx={buttonSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <IconBox>
            <ArticleIcon sx={{ color: "#1976d2", fontSize: 28 }} />
          </IconBox>
          <Box sx={{ fontSize: "18px", fontWeight: 500, color: "#111827" }}>
            My Posts
          </Box>
        </Box>
        <KeyboardArrowRightIcon
          fontSize="medium"
          className="arrowIcon"
          sx={{ color: "#c5c5c7ff", transition: "color 0.3s ease" }}
        />
      </Box>

      {/* Reservations */}
      <Box component="button" sx={buttonSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <IconBox>
            <EventSeatIcon sx={{ color: "#1976d2", fontSize: 28 }} />
          </IconBox>
          <Box sx={{ fontSize: "18px", fontWeight: 500, color: "#111827" }}>
            Reservations
          </Box>
        </Box>
        <KeyboardArrowRightIcon
          fontSize="medium"
          className="arrowIcon"
          sx={{ color: "#c5c5c7ff", transition: "color 0.3s ease" }}
        />
      </Box>
    </Box>
  );
};
