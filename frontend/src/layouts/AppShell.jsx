import { NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../services/authApi";
import { clearCredentials } from "../features/auth/authSlice";
import { useGetProjectByIdQuery } from "../services/projectApi";
import { useGetTaskByIdQuery } from "../services/taskApi";

export function AppShell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const projectMatch = useMatch("/projects/:projectId");
  const taskMatch = useMatch("/projects/:projectId/tasks/:taskId");
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const projectId = taskMatch?.params?.projectId || projectMatch?.params?.projectId;
  const taskId = taskMatch?.params?.taskId;
  const { data: projectData } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });
  const { data: taskData } = useGetTaskByIdQuery(
    { projectId, taskId },
    {
      skip: !projectId || !taskId,
    },
  );
  const projectName = projectData?.data?.name;
  const taskName = taskData?.data?.title;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Clear local auth state even if the backend session is already missing.
    } finally {
      dispatch(clearCredentials());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Syncora</p>
          <h2>Team workspace</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/projects" end>
            Projects
          </NavLink>

          {projectId ? (
            <div className="sidebar-route-tree">
              <NavLink
                className="sidebar-context-link"
                to={`/projects/${projectId}`}
                end
              >
                {projectName || "Current project"}
              </NavLink>

              {taskId ? (
                <NavLink
                  className="sidebar-context-link sidebar-context-link-child"
                  to={`/projects/${projectId}/tasks/${taskId}`}
                  end
                >
                  {taskName || "Current task"}
                </NavLink>
              ) : null}
            </div>
          ) : null}
        </nav>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-actions">
            <div>
              <p className="eyebrow">Signed in</p>
              <strong>{user?.fullName || user?.username || "Team member"}</strong>
            </div>

            <button
              className="secondary-button"
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
