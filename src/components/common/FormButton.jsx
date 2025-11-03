// src/components/common/FormButton.jsx
import React from "react";
import { Button } from "@mui/material";

const FormButton = ({ children, variant = "contained", ...props }) => {
  return (
    <Button
      variant={variant} // ✅ use the passed variant
      type="submit"
      className="w-full md:max-w-[280px]"
      sx={{
        borderRadius: "4px",
        ...(variant === "contained" && {
          backgroundColor: "var(--web-primary)",
          color: "white",
          fontFamily: "poppins, sans-serif",
        }),
        ...(variant === "outlined" && {
          borderColor: "var(--web-primary)",
          color: "var(--web-primary)",
        }),
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FormButton;
