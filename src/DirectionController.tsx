import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function DirectionController() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
  }, [i18n.language]);
  return null;
}
