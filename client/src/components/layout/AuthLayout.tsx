import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/system";
import { Box } from "@mui/material";
import notionLog from "../../assets/images/notion-logo.png";

const AuthLayout = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img
          src={notionLog}
          alt=""
          style={{ width: 100, height: 100, marginBottom: 2 }}
        />
        Notionクローン開発
      </Box>
      <Outlet />
    </Container>
  );
};

export default AuthLayout;
