import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import NavBar from "../../components/NavBar";
import { MyAccount } from "./MyAccount";
import MySetting from "./MySetting";
import { Account } from "./Account";
import { Support } from "./Support";
import StatsCards from "./StatsCards";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function AccountPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />
      <Grid container spacing={2} sx={{ padding: "30px 50px" }}>
        <Grid size={{ sm: 12, md: 8 }}>
          <Stack spacing={2}>
            <Item>
              <MyAccount />
            </Item>
            <StatsCards />
            <Item>
              <MySetting />
            </Item>
            <Item>
              <Account />
            </Item>
          </Stack>
        </Grid>
        <Grid size={{ sm: 12, md: 4 }}>
          <Item sx={{ boxSizing: "border-box" }}>
            <Support />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
