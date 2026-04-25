import { baseApi } from "./baseApi";

const getResponseItems = (result) =>
  Array.isArray(result?.data) ? result.data : [];

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: (result) => [
        "Project",
        ...getResponseItems(result).map((project) => ({
          type: "Project",
          id: project._id,
        })),
      ],
    }),
    getProjectById: builder.query({
      query: (projectId) => `/projects/${projectId}`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: projectId }],
    }),
    createProject: builder.mutation({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: ({ projectId, body }) => ({
        url: `/projects/${projectId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        "Project",
        { type: "Project", id: projectId },
      ],
    }),
    toggleProjectStar: builder.mutation({
      query: ({ projectId, starred }) => ({
        url: `/projects/${projectId}/star`,
        method: "PATCH",
        body: { starred },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        "Project",
        { type: "Project", id: projectId },
      ],
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project", "ProjectMembers", "TaskList", "Conversation"],
    }),
    getProjectMembers: builder.query({
      query: (projectId) => `/projects/${projectId}/members`,
      providesTags: (result, error, projectId) => [
        { type: "ProjectMembers", id: projectId },
      ],
    }),
    addProjectMember: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "ProjectMembers", id: projectId },
        { type: "Project", id: projectId },
      ],
    }),
    updateProjectMemberRole: builder.mutation({
      query: ({ projectId, userId, ...body }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "ProjectMembers", id: projectId },
      ],
    }),
    deleteProjectMember: builder.mutation({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "ProjectMembers", id: projectId },
        { type: "Project", id: projectId },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useToggleProjectStarMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useUpdateProjectMemberRoleMutation,
  useDeleteProjectMemberMutation,
} = projectApi;
