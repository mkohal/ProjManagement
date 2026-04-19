import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateProjectMutation, useGetProjectsQuery } from "../services/projectApi";

export function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { data, isLoading, isFetching, isError, error } = useGetProjectsQuery();
  const [createProject, { isLoading: isCreating, error: createError }] =
    useCreateProjectMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const projects = data?.data ?? [];

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    reset({
      name: "",
      description: "",
    });
  };

  const onCreateProject = async (values) => {
    setSuccessMessage("");

    const response = await createProject(values).unwrap();
    const createdProject = response?.data;

    closeCreateModal();
    setSuccessMessage(
      createdProject?.name
        ? `${createdProject.name} is ready in Syncora.`
        : "Project created successfully.",
    );
  };

  return (
    <div className="page-stack">
      <section className="projects-hero">
        <div className="page-header">
          <div>
            <p className="eyebrow">Projects</p>
            <h1>Your workspace projects</h1>
            <p>Browse active workspaces, open a project, or start a new one when the team is ready.</p>
          </div>
          <div className="page-header-meta">
            <span className="pill">{projects.length} total</span>
            <button
              className="primary-button"
              type="button"
              onClick={() => {
                setSuccessMessage("");
                reset({
                  name: "",
                  description: "",
                });
                setIsCreateModalOpen(true);
              }}
            >
              Add project
            </button>
          </div>
        </div>

        <div className="projects-summary-grid">
          <article className="summary-card">
            <span>Projects you can access</span>
            <strong>{projects.length}</strong>
            <p>Every workspace you belong to is available here for quick access.</p>
          </article>
          <article className="summary-card">
            <span>What you can do</span>
            <strong>Plan</strong>
            <p>Create projects, organize tasks, and keep work visible across the team.</p>
          </article>
        </div>
      </section>

      {!projects.length && (isLoading || isFetching) ? (
        <p className="panel">Loading projects...</p>
      ) : null}
      {isError ? (
        <p className="panel">{error?.data?.message || "Failed to load projects."}</p>
      ) : null}

      <section className="section-heading">
        <div>
          <p className="eyebrow">Project list</p>
          <h2>Open an existing project</h2>
        </div>
      </section>

      <section className="project-grid">
        {projects.map((project) => (
          <article key={project._id} className="project-card project-card-compact">
            <div className="project-card-top">
              <span className="project-role-badge">{project.role}</span>
            </div>
            <Link className="project-card-link" to={`/projects/${project._id}`}>
              <div className="project-card-body">
                <h3>{project.name}</h3>
                <div className="project-metrics">
                  <span>{project.members} members</span>
                  <span>{project.taskCount || 0} tasks</span>
                </div>
              </div>
            </Link>
          </article>
        ))}

        {!isLoading && !projects.length ? (
          <div className="project-card project-card-compact empty-state">
            <h3>No projects yet</h3>
            <p>
              Start your first workspace with the add project button and it will appear here right away.
            </p>
          </div>
        ) : null}
      </section>

      {successMessage ? <p className="form-success">{successMessage}</p> : null}

      {isCreateModalOpen ? (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={closeCreateModal}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-project-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Create project</p>
                <h2 id="create-project-title">Start a new workspace</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={closeCreateModal}
                aria-label="Close create project popup"
              >
                ×
              </button>
            </div>

            <form className="project-form" onSubmit={handleSubmit(onCreateProject)}>
              <label className="field">
                <span>Project name</span>
                <input
                  type="text"
                  placeholder="Website redesign"
                  {...register("name", {
                    required: "Project name is required",
                  })}
                />
                {errors.name ? <small>{errors.name.message}</small> : null}
              </label>

              <label className="field">
                <span>Description</span>
                <textarea
                  placeholder="Write a short summary of what this project is about."
                  rows={5}
                  {...register("description")}
                />
              </label>

              {createError?.data?.message ? (
                <p className="form-error">{createError.data.message}</p>
              ) : null}

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={closeCreateModal}
                >
                  Cancel
                </button>
                <button className="primary-button" type="submit" disabled={isCreating}>
                  {isCreating ? "Creating project..." : "Create project"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
