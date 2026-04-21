import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateProjectMutation, useGetProjectsQuery } from "../services/projectApi";
import { resolveAssetUrl } from "../utils/assets";

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
      coverImage: null,
    },
  });
  const projects = data?.data ?? [];
  const getProjectProgress = (project) =>
    Number.isFinite(project?.progressPercentage) ? project.progressPercentage : 0;

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    reset({
      name: "",
      description: "",
      coverImage: null,
    });
  };

  const onCreateProject = async (values) => {
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("name", values.name?.trim() || "");
    formData.append("description", values.description?.trim() || "");

    if (values.coverImage?.[0]) {
      formData.append("coverImage", values.coverImage[0]);
    }

    const response = await createProject(formData).unwrap();
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

      {!projects.length && (isLoading || isFetching) ? (
        <p className="panel">Loading projects...</p>
      ) : null}
      {isError ? (
        <p className="panel">
          {error?.data?.message || "Failed to load projects."}
        </p>
      ) : null}

      <section className="section-heading">
        <div>
          <p className="eyebrow">Project list</p>
          <h2>Open an existing project</h2>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setSuccessMessage("");
              reset({
                name: "",
                description: "",
                coverImage: null,
              });
              setIsCreateModalOpen(true);
            }}
        >
          Add project
        </button>
      </section>

      <section className="project-grid">
        {projects.map((project) => (
          <article
            key={project._id}
            className="project-card project-card-compact"
          >
            <Link className="project-card-link" to={`/projects/${project._id}`}>
              <div className="project-card-header">
                {project.coverImage?.url ? (
                  <img
                    className="project-card-image"
                    src={resolveAssetUrl(project.coverImage.url)}
                    alt={`${project.name} cover`}
                  />
                ) : (
                  <div className="project-card-mark" aria-hidden="true">
                    <span className="project-card-mark-a" />
                    <span className="project-card-mark-b" />
                    <span className="project-card-mark-c" />
                  </div>
                )}
                <h3>{project.name}</h3>
              </div>

              <div className="project-card-divider" />

              <div className="project-card-body">
                <div className="project-card-members-row">
                  <div className="project-member-stack" aria-hidden="true">
                    {(project.memberPreview || []).map((member) => (
                      <img
                        key={member._id || member.username}
                        className="project-member-avatar"
                        src={
                          member.avatarUrl
                            ? resolveAssetUrl(member.avatarUrl)
                            : "https://placehold.co/200x200"
                        }
                        alt=""
                      />
                    ))}
                  </div>
                  <span className="project-members-text">
                    {project.members} {project.members === 1 ? "member" : "members"}
                  </span>
                </div>

                <div className="project-progress-block">
                  <div className="project-progress-header">
                    <span>Project Progress</span>
                    <strong>{getProjectProgress(project)}%</strong>
                  </div>
                  <div
                    className="project-progress-bar"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={getProjectProgress(project)}
                    aria-label={`${project.name} progress`}
                  >
                    <span
                      className="project-progress-fill"
                      style={{ width: `${getProjectProgress(project)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}

        {!isLoading && !projects.length ? (
          <div className="project-card project-card-compact empty-state">
            <h3>No projects yet</h3>
            <p>
              Start your first workspace with the add project button and it will
              appear here right away.
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

            <form
              className="project-form"
              onSubmit={handleSubmit(onCreateProject)}
            >
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

              <label className="field">
                <span>Project image</span>
                <input
                  type="file"
                  accept="image/*"
                  {...register("coverImage")}
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
                <button
                  className="primary-button"
                  type="submit"
                  disabled={isCreating}
                >
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
