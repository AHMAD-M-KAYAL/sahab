import { useGetStaticContents } from "../../hook/useGetStaticContents";
import { Box, Typography, Paper } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import IconBack from "../../assets/logo/back.svg";

interface Props {
  title: string;
  text: string;
}

const StaticContents = ({ title, text }: Props) => {
  const { data } = useGetStaticContents(title);
  const navigate = useNavigate();

  return (
    <>
      {" "}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: "800px",
            p: 4,
            borderRadius: "16px",
            backgroundColor: "white",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="700"
            gutterBottom
            sx={{ textAlign: "center", color: "var(--main-color)" }}
          >
            {text}
          </Typography>

          <Typography variant="body1">{data?.content}</Typography>
        </Paper>
      </Box>
    </>
  );
};

export default StaticContents;
