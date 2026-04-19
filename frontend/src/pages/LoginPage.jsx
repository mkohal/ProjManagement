import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../services/authApi";
import { setCredentials } from "../features/auth/authSlice";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const from = location.state?.from?.pathname || "/projects";

  const onSubmit = async (values) => {
    const response = await login(values).unwrap();
    const payload = response?.data;

    dispatch(
      setCredentials({
        user: payload?.user,
        accessToken: payload?.accessToken,
        refreshToken: payload?.refreshToken,
      }),
    );

    navigate(from, { replace: true });
  };

  return (
    <div className="form-stack auth-form-shell">
      <div className="auth-form-header">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in to your workspace</h2>
        <p className="muted-text">
          Use your account to continue managing projects, tasks, and team conversations.
        </p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            placeholder="mahesh@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email ? <small>{errors.email.message}</small> : null}
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password ? <small>{errors.password.message}</small> : null}
        </label>

        {error?.data?.message ? <p className="form-error">{error.data.message}</p> : null}

        <button className="primary-button" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="muted-text auth-switch-text">
        Don&apos;t have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
