import Box from "@mui/material/Box";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Avatar from "@mui/material/Avatar";

const MySetting = () => {
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
        Setting
      </Box>

      {/* Change Language */}
      <Box component="button" sx={buttonSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar
            variant="rounded"
            sx={{ bgcolor: "#fff4e6", width: 36, height: 36 }}
          >
            <PublicIcon sx={{ color: "#f97316" }} />
          </Avatar>
          Change Language
        </Box>
        <KeyboardArrowRightIcon
          fontSize="medium"
          className="arrowIcon"
          sx={{ color: "#c5c5c7ff", transition: "color 0.3s ease" }}
        />
      </Box>

      {/* Notification */}
      <Box component="button" sx={buttonSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar
            variant="rounded"
            sx={{ bgcolor: "#fff4e6", width: 36, height: 36 }}
          >
            <NotificationsNoneIcon sx={{ color: "#f97316" }} />
          </Avatar>
          Notification
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

export default MySetting;
