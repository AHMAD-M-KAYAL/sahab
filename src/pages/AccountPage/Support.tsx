import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";

// أيقونات لكل عنصر
import InfoIcon from "@mui/icons-material/Info";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import GavelIcon from "@mui/icons-material/Gavel";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LogoutIcon from "@mui/icons-material/Logout";
import apiClient from "../../services/api-client";

export const Support = () => {
  // ستايل الأزرار العامة
  const buttonSx = {
    backgroundColor: "white",
    display: "flex",
    height: "70px",
    border: "2px solid #e4e4e7",
    borderRadius: "10px",
    padding: "10px 15px",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: "20px",
    "&:hover": {
      backgroundColor: "#f3f4f6",
      borderColor: "#d1d5db",
      "& .arrowIcon": { color: "#000000" },
    },
  };

  // صندوق الأيقونة
  const IconBox = ({
    children,
    bg = "#f3f4f6",
  }: {
    children: React.ReactNode;
    bg?: string;
  }) => (
    <Avatar
      variant="rounded"
      sx={{
        bgcolor: bg,
        width: 50,
        height: 50,
      }}
    >
      {children}
    </Avatar>
  );
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/SentNumber");
        return;
      }

      // نرسل طلب الـ logout مع الـ token
      await apiClient.post(
        "api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // امسح البيانات المخزنة
      localStorage.removeItem("token");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userName");

      // رجّع المستخدم لصفحة تسجيل الدخول
      navigate("/SentNumber");
    } catch (error) {
      console.error("Logout failed", error);
      // حتى لو فشل السيرفر، نرجّع المستخدم ونمسح التوكن
      localStorage.removeItem("token");
      navigate("/SentNumber");
    }
  };

  return (
    <Box
      sx={{
        padding: "10px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "fitContent",
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
        Support
      </Box>

      {/* About Sahab */}
      <Box component="button" sx={buttonSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <IconBox>
            <InfoIcon sx={{ color: "#374151", fontSize: 28 }} />
          </IconBox>
          <Box sx={{ fontSize: "18px", fontWeight: 500, color: "#111827" }}>
            About Sahab
          </Box>
        </Box>
        <KeyboardArrowRightIcon
          fontSize="medium"
          className="arrowIcon"
          sx={{ color: "#9ca3af", transition: "color 0.3s ease" }}
        />
      </Box>

      {/* Privacy Policy */}
      <Box component="button" sx={buttonSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <IconBox>
            <PrivacyTipIcon sx={{ color: "#374151", fontSize: 28 }} />
          </IconBox>
          <Box sx={{ fontSize: "18px", fontWeight: 500, color: "#111827" }}>
            Privacy Policy
          </Box>
        </Box>
        <KeyboardArrowRightIcon
          fontSize="medium"
          className="arrowIcon"
          sx={{ color: "#9ca3af", transition: "color 0.3s ease" }}
        />
      </Box>

      {/* Terms & Conditions */}
      <Box component="button" sx={buttonSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <IconBox>
            <GavelIcon sx={{ color: "#374151", fontSize: 28 }} />
          </IconBox>
          <Box sx={{ fontSize: "18px", fontWeight: 500, color: "#111827" }}>
            Terms & Conditions
          </Box>
        </Box>
        <KeyboardArrowRightIcon
          fontSize="medium"
          className="arrowIcon"
          sx={{ color: "#9ca3af", transition: "color 0.3s ease" }}
        />
      </Box>

      {/* Contacts us */}
      <Box component="button" sx={buttonSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <IconBox>
            <ContactMailIcon sx={{ color: "#374151", fontSize: 28 }} />
          </IconBox>
          <Box sx={{ fontSize: "18px", fontWeight: 500, color: "#111827" }}>
            Contacts us
          </Box>
        </Box>
        <KeyboardArrowRightIcon
          fontSize="medium"
          className="arrowIcon"
          sx={{ color: "#9ca3af", transition: "color 0.3s ease" }}
        />
      </Box>

      {/* Logout (أحمر) */}
      <Box
        // خليه عنصر عادي + أعطيه دور "زر"
        role="button"
        tabIndex={0}
        onClick={handleLogout}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleLogout();
        }}
        sx={{
          ...buttonSx,
          backgroundColor: "#fee2e2",
          border: "2px solid #fca5a5",
          "&:hover": {
            backgroundColor: "#fca5a5",
            borderColor: "#ef4444",
            "& .arrowIcon": { color: "#fff" },
            cursor: "pointer",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <IconBox bg="#fecaca">
            <LogoutIcon sx={{ color: "#dc2626", fontSize: 28 }} />
          </IconBox>
          {/* شيل onClick من هون */}
          <Box sx={{ fontSize: "18px", fontWeight: 600, color: "#b91c1c" }}>
            Logout
          </Box>
        </Box>
        <KeyboardArrowRightIcon
          fontSize="medium"
          className="arrowIcon"
          sx={{ color: "#dc2626", transition: "color 0.3s ease" }}
        />
      </Box>
    </Box>
  );
};
