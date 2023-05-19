import axios from "axios";

export const useAuthApi = () => {
  const registerUser = async (params: any) => {
    console.log(params);
    return await axios({
      method: "post",
      baseURL: "http://localhost:5000/api",
      url: "/register",
      data: {
        ...params,
      },
    });
  };

  const loginUser = async (params: any) => {
    console.log(params);
    return await axios({
      method: "post",
      baseURL: "http://localhost:5000/api",
      url: "/login",
      data: {
        ...params,
      },
    });
  };
  return { registerUser, loginUser };
};
