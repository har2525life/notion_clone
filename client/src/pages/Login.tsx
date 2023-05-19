import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";

type LoginForm = {
  username: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit } = useForm<LoginForm>();

  const loginUser = () => {};
  return (
    <>
      <Box component="form" onSubmit={handleSubmit(loginUser)}>
        <TextField
          {...register("username")}
          fullWidth
          label="ユーザーネーム"
          margin="normal"
          required
        />
        <TextField
          {...register("password")}
          fullWidth
          type="password"
          label="パスワード"
          margin="normal"
          required
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ my: 2 }}
          loading={false}
        >
          LOGIN
        </LoadingButton>
      </Box>
      <Button component={Link} to="/register">
        まだアカウントを持っていませんか? アカウント作成
      </Button>
    </>
  );
};

export default Login;
