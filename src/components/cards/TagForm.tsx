import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import { t } from "i18next";
interface Props {
  type: string;
  setType: (type: string) => void;
}
export default function TagForm({ type, setType }: Props) {
  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label"> Type</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={type}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value={"none"}>{t("None")}</MenuItem>
        <MenuItem value={"all"}>{t("All")}</MenuItem>
        <MenuItem value={"family only"}>{t("Family Only")}</MenuItem>
        <MenuItem value={"girls only"}>{t("Girls Only")}</MenuItem>
      </Select>
    </FormControl>
  );
}
