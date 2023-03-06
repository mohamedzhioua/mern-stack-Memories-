import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { setCredentials } from "../../app/features/user/userSlice";
import { AuthInput, Card, CustomButton, FormLoader } from "../../components";
import { FaSignInAlt } from "react-icons/fa";
import "./index.css";
import ZIWIBook from "../../icons/ZIWIBook.png";
import { useLoginMutation } from "../../app/features/auth/authSlice";

const LoginForm = ({ setShowRegister }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = { email: "", password: "" };
  const { email, password } = form;
  const [login, { isLoading,isSuccess }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [navigate, dispatch, isSuccess]);

  // eye show hide handler
  const [passwordVisible, setPasswordVisible] = useState(false);
  const Eye = () => {
    setPasswordVisible(!passwordVisible);
  };

  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required.")
      .email("Must be a valid email.")
      .max(100),
    password: Yup.string().required("Password is required").min(8),
  });

  return (
    <div class="login-container">
      <div className="login-head">
        <img src={ZIWIBook} alt="" className="login-image" />
        <span className="login-span">
          ZIWIbook helps you connect and share with the people in your life.
        </span>
      </div>
      <Card className="login-card">
        <h1>
          <FaSignInAlt /> Sing In
        </h1>
        <Formik
          enableReinitialize={false}
          validationSchema={loginValidation}
          initialValues={{
            email,
            password,
          }}
          onSubmit={async (values, { setFieldError }) => {
            try {
              const userData = await login(values).unwrap();
              dispatch(setCredentials({ ...userData }));
            } catch (error) {
              setFieldError("email", error.data.email);
              setFieldError("password", error.data.password);
            }
          }}
        >
          {(formik) => {
            return (
              <Form className="login-form">
                <FormLoader loading={isLoading}>
                  <AuthInput
                    type="text"
                    name="email"
                    placeholder="Email address"
                  />

                  <AuthInput
                    name="password"
                    placeholder="password"
                    type={passwordVisible ? "text" : "password"}
                    onClick={Eye}
                  />
                </FormLoader>
                <CustomButton className="button" type="submit" value="submit" />
              </Form>
            );
          }}
        </Formik>

        <div className="login" onClick={() => setShowRegister(true)}>
          <span className="login_link">Not a member? Register</span>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
