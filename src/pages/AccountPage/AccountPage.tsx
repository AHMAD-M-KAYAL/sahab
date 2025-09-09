/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import NavBar from "../../components/NavBar";
import { MyAccount } from "./MyAccount";
import MySetting from "./MySetting";
import { Account } from "./Account";
import { Support } from "./Support";
import axios from "axios";
import { AccountVendor } from "./AccountVendor";

// ===== helper: read token the same way your app stores it =====
function readToken(): string | null {
  const direct =
    localStorage.getItem("token") || localStorage.getItem("access_token");
  if (direct) return direct;

  try {
    const obj = JSON.parse(localStorage.getItem("auth") || "{}");
    if (obj?.token) return obj.token as string;
    if (obj?.access_token) return obj.access_token as string;
  } catch {
    /* empty */
  }
  return null;
}

const CHECK_ROLE_URL = "https://sahab.ghinashop.net/api/users/check-role";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles?.("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function AccountPage() {
  const [loadingRole, setLoadingRole] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const [roleError, setRoleError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoadingRole(true);
      setRoleError("");

      const token = readToken();
      if (!token) {
        if (mounted) {
          setIsVendor(false);
          setRoleError("Missing auth token. Please login again.");
          setLoadingRole(false);
        }
        return;
      }

      try {
        const res = await axios.get(CHECK_ROLE_URL, {
          headers: {
            Accept: "application/json",
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
          },
        });

        // Try to be flexible with API shape
        const data = res.data;
        const roleFromData =
          (typeof data?.role === "string" && data.role) ||
          (typeof data?.data?.role === "string" && data.data.role) ||
          (typeof data?.user?.role === "string" && data.user.role) ||
          (Array.isArray(data?.roles) && data.roles[0]) ||
          "";

        const normalized = String(roleFromData).toLowerCase();
        const vendorDetected =
          normalized === "vendor" ||
          normalized.includes("vendor") ||
          // بعض الأنظمة ترجع أدوار متعددة مثل ["vendor","user"]
          (Array.isArray(data?.roles) &&
            data.roles
              .map((r: any) => String(r).toLowerCase())
              .includes("vendor"));

        if (mounted) {
          setIsVendor(!!vendorDetected);
        }
      } catch (e: any) {
        if (mounted) {
          setIsVendor(false);
          setRoleError(
            e?.response?.data?.message || e?.message || "Failed to check role."
          );
        }
      } finally {
        if (mounted) setLoadingRole(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />

      {/* حالة التحميل / الخطأ الخاصة بفحص الدور */}
      {loadingRole && (
        <Box sx={{ px: 4, pt: 2 }}>
          <Alert icon={<CircularProgress size={16} />} severity="info">
            Checking your role…
          </Alert>
        </Box>
      )}
      {!loadingRole && roleError && (
        <Box sx={{ px: 4, pt: 2 }}>
          <Alert severity="warning">{roleError}</Alert>
        </Box>
      )}

      <Grid container spacing={2} sx={{ padding: "30px 50px" }}>
        <Grid size={{ sm: 12, md: 8 }}>
          <Stack spacing={2}>
            <Item>
              <MyAccount />
            </Item>

            {/* <StatsCards /> */}

            <Item>
              <MySetting />
            </Item>

            {/* إظهار Account فقط إذا كان الدور Vendor */}
            {!loadingRole && isVendor && (
              <Item>
                <AccountVendor />
              </Item>
            )}
            {/* إظهار Account فقط إذا كان الدور Vendor */}
            {!isVendor && (
              <Item>
                <Account />
              </Item>
            )}
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
