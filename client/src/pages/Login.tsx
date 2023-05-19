import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useNavigate } from "react-router-dom";
import { useAuthApi } from "../api/useAuthApi";
import { AxiosResponse } from "axios";

type LoginForm = {
  username: string;
  password: string;
};

type UserInfo = {
  token: string;
  userInfo: {
    id: string;
    username: string;
  };
};

const Login = () => {
  const navigate = useNavigate();
  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm<LoginForm>();
  const { loginUser } = useAuthApi();

  const login = (event: LoginForm) => {
    setIsLoading(true);
    setUsernameErrorText("");
    setPasswordErrorText("");

    const { username, password } = event;
    let error = false;
    if (username === "") {
      error = true;
      setUsernameErrorText("名前を入力してください");
    }
    if (password === "") {
      error = true;
      setPasswordErrorText("パスワードを入力してください");
    }

    if (error) {
      setIsLoading(false);
      return;
    }

    const test = loginUser(event)
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
        console.log(errors)
        errors.forEach((error: any) => {
          const { path, msg } = error;
          //   console.log(path, msg);
          if (path === "username") {
            setUsernameErrorText(msg);
          }
          if (path === "password") {
            setPasswordErrorText(msg);
          }
        });
      });
    console.log(test);
    // try {
    // }
  };
  return (
    <>
      <Box component="form" onSubmit={handleSubmit(login)} noValidate>
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
      <Button component={Link} to="/register">
        すでにアカウントを持っていませんか？ 新規登録
      </Button>
    </>
  );
};

export default Login;
