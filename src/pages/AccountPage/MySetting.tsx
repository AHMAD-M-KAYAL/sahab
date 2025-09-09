import Box from "@mui/material/Box";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Avatar from "@mui/material/Avatar";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const MySetting = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
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

  // تغيير اللغة بين ar و en
  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang); // هذا يعمل re-render تلقائيًا لكل كمبوننت يستخدم useTranslation
    localStorage.setItem("lang", newLang);
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
        {t("Setting")}
      </Box>

      {/* Change Language */}
      <Box
        component="button"
        sx={{
          ...buttonSx,
          backgroundColor: i18n.language === "ar" ? "#ecfdf5" : "#eff6ff", // أخضر فاتح لو ar، أزرق فاتح لو en
          border:
            i18n.language === "ar" ? "2px solid #10b981" : "2px solid #3b82f6",
          "&:hover": {
            backgroundColor: i18n.language === "ar" ? "#d1fae5" : "#dbeafe",
            borderColor: i18n.language === "ar" ? "#059669" : "#2563eb",
            "& .arrowIcon": {
              color: i18n.language === "ar" ? "#059669" : "#2563eb",
            },
          },
        }}
        onClick={toggleLanguage}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: i18n.language === "ar" ? "#a7f3d0" : "#bfdbfe", // أخضر/أزرق فاتح للأيقونة
              width: 36,
              height: 36,
            }}
          >
            <PublicIcon
              sx={{
                color: i18n.language === "ar" ? "#047857" : "#1d4ed8", // أخضر غامق لو ar، أزرق غامق لو en
              }}
            />
          </Avatar>
          <Box
            sx={{
              fontWeight: 600,
              fontSize: "18px",
              color: i18n.language === "ar" ? "#065f46" : "#1e3a8a",
            }}
          >
            {i18n.language === "ar" ? "اللغة: العربية" : "Language: English"}
          </Box>
        </Box>
        <KeyboardArrowRightIcon
          fontSize="medium"
          className="arrowIcon"
          sx={{
            color: i18n.language === "ar" ? "#10b981" : "#3b82f6",
            transition: "color 0.3s ease",
          }}
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
          {t("Notification")}
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
