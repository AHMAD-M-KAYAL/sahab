import Input from "@mui/joy/Input";
import SearchIcon from "../assets/logo/Search.svg";
import Box from "@mui/material/Box";
import Link from "@mui/joy/Link";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NavBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => pathname.toLowerCase().startsWith(path);

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: "white",
        boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
      }}
    >
      <div className="container-fluid">
        <Box
          className="navbar-brand mb-0 h1"
          sx={{ width: "10%", textAlign: "center" }}
        >
          {t("Sahab")}
        </Box>
        <Input
          onClick={() => {
            console.log("clicked");
            navigate("SearchPage");
          }}
          color="neutral"
          placeholder="Search"
          size="lg"
          variant="outlined"
          endDecorator={<Box component="img" src={SearchIcon} />}
          sx={{ borderRadius: "50px", width: "50%" }}
        />
        <Box
          sx={{ display: "flex", width: "30%", justifyContent: "space-evenly" }}
        >
          <Link
            component="button"
            onClick={() => navigate("/Home")}
            sx={{
              color: isActive("/home") ? "var(--main-color)" : "#00000099",
            }}
            underline="none"
            color="neutral"
          >
            {t("Home")}
          </Link>

          <Link
            component="button"
            onClick={() => navigate("/Booking")}
            sx={{
              color: isActive("/booking") ? "var(--main-color)" : "#00000099",
            }}
            underline="none"
            color="neutral"
          >
            {t("Booking")}
          </Link>

          <Link
            component="button"
            onClick={() => navigate("/Account")}
            sx={{
              color: isActive("/account") ? "var(--main-color)" : "#00000099",
            }}
            underline="none"
            color="neutral"
          >
            {t("Account")}
          </Link>
        </Box>
      </div>
    </nav>
  );
};

export default NavBar;
