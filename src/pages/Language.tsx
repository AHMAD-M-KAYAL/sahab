import Box from "@mui/material/Box";
import Group from "../assets/logo/Group 1.svg";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Language = () => {
  const setLan = () =>
    setTimeout(() => {
      navigate("/SentNumber");
    }, 1000);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        src={Group}
        sx={{
          width: 100, // أو أي حجم بدك إياه (مثلاً 32px)
          height: 100,
          objectFit: "cover",
        }}
      />
      <Box
        sx={{
          fontFamily: "sans-serif",
          fontWeight: "700",
          fontSize: { md: "50px" },
        }}
      >
        {t("chooseLanguage")}
      </Box>
      <Box sx={{ fontFamily: "Poppins", fontSize: { md: "30px" } }}>
        {t("chooseLanguageplz")}
      </Box>
      <Button
        onClick={() => {
          i18n.changeLanguage("en");
          setLan();
        }}
        variant="contained"
        sx={{
          backgroundColor: "var(--main-color)",
          width: { md: "140px" },
          height: { md: "50px" },
        }}
      >
        English
      </Button>
      <Button
        onClick={() => {
          i18n.changeLanguage("ar");
          setLan();
        }}
        variant="contained"
        sx={{
          backgroundColor: "var(--second-color)",
          width: { md: "140px" },
          height: { md: "50px" },
        }}
      >
        العربية
      </Button>
    </Box>
  );
};

export default Language;
