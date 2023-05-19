import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useNavigate } from "react-router-dom";
import { useAuthApi } from "../api/useAuthApi";
import { AxiosResponse } from "axios";

type RegisterForm = {
  username: string;
  password: string;
  confirmPassword: string;
};

type UserInfo = {
  token: string;
  userInfo: {
    id: string;
    username: string;
  };
};

const Register = () => {
  const navigate = useNavigate();
  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm<RegisterForm>();
  const { registerUser } = useAuthApi();

  const createUser = (event: RegisterForm) => {
    setIsLoading(true);
    setUsernameErrorText("");
    setPasswordErrorText("");
    setConfirmPasswordErrorText("");

    const { username, password, confirmPassword } = event;
    let error = false;
    if (username === "") {
      error = true;
      setUsernameErrorText("名前を入力してください");
    }
    if (password === "") {
      error = true;
      setPasswordErrorText("パスワードを入力してください");
    }
    if (confirmPassword === "") {
      error = true;
      setConfirmPasswordErrorText("確認用パスワードを入力してください");
    } else if (password !== confirmPassword) {
      error = true;
      setConfirmPasswordErrorText("パスワードと確認用パスワードが異なります。");
    }

    if (error) {
      setIsLoading(false);
      return;
    }

    const test = registerUser(event)
      .then((result: AxiosResponse<UserInfo>) => {
        // setIsLoading(false);
        console.log(result);
        const token = result.data.token;
        localStorage.setItem("token", token);
        navigate("/");
      })
      .catch((error: any) => {
        setIsLoading(false);
        // console.log(error);
        const errors = error.response.data.errors;
        errors.forEach((error: any) => {
          const { path, msg } = error;
          //   console.log(path, msg);
          if (path === "username") {
            setUsernameErrorText(msg);
          }
          if (path === "password") {
            setPasswordErrorText(msg);
          }
          if (path === "confirmPassword") {
            setConfirmPasswordErrorText(msg);
          }
        });
      });
    console.log(test);
    // try {
    // }
  };
  return (
    <>
      <Box component="form" onSubmit={handleSubmit(createUser)} noValidate>
        <TextField
          {...register("username")}
          fullWidth
          label="ユーザーネーム"
          margin="normal"
          required
          helperText={usernameErrorText}
          error={usernameErrorText !== ""}
          disabled={isLoading}
        />
        <TextField
          {...register("password")}
          fullWidth
          type="password"
          label="パスワード"
          margin="normal"
          required
          helperText={passwordErrorText}
          error={passwordErrorText !== ""}
          disabled={isLoading}
        />
        <TextField
          {...register("confirmPassword")}
          fullWidth
          type="password"
          label="確認用パスワード"
          margin="normal"
          required
          helperText={confirmPasswordErrorText}
          error={confirmPasswordErrorText !== ""}
          disabled={isLoading}
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ my: 2 }}
          loading={isLoading}
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
