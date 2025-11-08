// src/components/common/FormButton.jsx
import React from "react";
import { Button } from "@mui/material";

const FormButton = ({
  children,
  variant = "contained",
  bgColor,
  textColor,
  fullWidth = true,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      type="submit"
      className={fullWidth ? "w-full md:max-w-[280px]" : ""}
      sx={{
        borderRadius: "4px",
        fontFamily: "poppins, sans-serif",
        padding: "10px 6px",

        ...(variant === "contained" && {
          backgroundColor: bgColor
            ? `${bgColor} !important`
            : "var(--web-primary)",
          color: textColor
            ? `${textColor} !important`
            : "white",
        }),

        ...(variant === "outlined" && {
          borderColor: bgColor
            ? `${bgColor} !important`
            : "var(--web-primary)",
          color: textColor
            ? `${textColor} !important`
            : bgColor
              ? `${bgColor} !important`
              : "var(--web-primary)",
        }),
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FormButton;
