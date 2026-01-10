import { mkConfig } from "export-to-csv";

export const csvConfig = mkConfig({
  useKeysAsHeaders: true,  // Use object keys as column headers
  fieldSeparator: ",",
  decimalSeparator: ".",
  filename: "shotlist_export",
  useBom: true,            // UTF-8 support
});


