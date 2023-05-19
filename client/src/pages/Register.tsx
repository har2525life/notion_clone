import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";
import { useAuthApi } from "../api/useAuthApi";

type RegisterForm = {
  username: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const { registerUser } = useAuthApi();

  const createUser = (event: RegisterForm) => {
    const test = registerUser(event).then((result) => {
        console.log(result)
    });
    console.log(test);
    // try {
    // }
  };
  return (
    <>
      <Box component="form" onSubmit={handleSubmit(createUser)}>
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
        <TextField
          {...register("confirmPassword")}
          fullWidth
          type="password"
          label="確認用パスワード"
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
          Register
        </LoadingButton>
      </Box>
      <Button component={Link} to="/login">
        すでにアカウントを持っていますか？ ログイン
      </Button>
    </>
  );
};

export default Register;
