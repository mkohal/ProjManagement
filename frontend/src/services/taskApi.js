import { baseApi } from "./baseApi";

const getResponseItems = (result) =>
  Array.isArray(result?.data) ? result.data : [];

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (projectId) => `/tasks/${projectId}`,
      providesTags: (result, error, projectId) => [
        { type: "TaskList", id: projectId },
        ...getResponseItems(result).map((task) => ({
          type: "Task",
          id: task._id,
        })),
      ],
    }),
    getTaskById: builder.query({
      query: ({ projectId, taskId }) => `/tasks/${projectId}/t/${taskId}`,
      providesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),
    createTask: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `/tasks/${projectId}`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const createdTask = data?.data;

          if (!createdTask) {
            return;
          }

          dispatch(
            taskApi.util.updateQueryData("getTasks", projectId, (draft) => {
              if (!Array.isArray(draft?.data)) {
                return;
              }

              draft.data.unshift(createdTask);
            }),
          );
        } catch {
          // Keep existing cache untouched when task creation fails.
        }
      },
    }),
    updateTaskDetails: builder.mutation({
      query: ({ projectId, taskId, ...body }) => ({
        url: `/tasks/${projectId}/t/${taskId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { projectId, taskId }) => [
        { type: "TaskList", id: projectId },
        { type: "Task", id: taskId },
      ],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ projectId, taskId, status }) => ({
        url: `/tasks/${projectId}/t/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { projectId, taskId }) => [
        { type: "TaskList", id: projectId },
        { type: "Task", id: taskId },
      ],
    }),
    deleteTask: builder.mutation({
      query: ({ projectId, taskId }) => ({
        url: `/tasks/${projectId}/t/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId, taskId }) => [
        { type: "TaskList", id: projectId },
        { type: "Task", id: taskId },
        { type: "SubtaskList", id: taskId },
      ],
    }),
    getSubtasksByTaskId: builder.query({
      query: ({ projectId, taskId }) => `/tasks/${projectId}/t/${taskId}/subtasks`,
      providesTags: (result, error, { taskId }) => [
        { type: "SubtaskList", id: taskId },
        ...getResponseItems(result).map((subtask) => ({
          type: "Subtask",
          id: subtask._id,
        })),
      ],
    }),
    getSubtaskById: builder.query({
      query: ({ projectId, subTaskId }) => `/tasks/${projectId}/st/${subTaskId}`,
      providesTags: (result, error, { subTaskId }) => [{ type: "Subtask", id: subTaskId }],
    }),
    createSubtask: builder.mutation({
      query: ({ projectId, taskId, formData }) => ({
        url: `/tasks/${projectId}/t/${taskId}/subtasks`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "SubtaskList", id: taskId },
      ],
    }),
    updateSubtaskDetails: builder.mutation({
      query: ({ projectId, subTaskId, ...body }) => ({
        url: `/tasks/${projectId}/st/${subTaskId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { subTaskId }) => [
        { type: "Subtask", id: subTaskId },
      ],
    }),
    updateSubtaskStatus: builder.mutation({
      query: ({ projectId, subTaskId, status }) => ({
        url: `/tasks/${projectId}/st/${subTaskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { subTaskId }) => [
        { type: "Subtask", id: subTaskId },
      ],
    }),
    deleteSubtask: builder.mutation({
      query: ({ projectId, subTaskId }) => ({
        url: `/tasks/${projectId}/st/${subTaskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { subTaskId }) => [
        { type: "Subtask", id: subTaskId },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskDetailsMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetSubtasksByTaskIdQuery,
  useGetSubtaskByIdQuery,
  useCreateSubtaskMutation,
  useUpdateSubtaskDetailsMutation,
  useUpdateSubtaskStatusMutation,
  useDeleteSubtaskMutation,
} = taskApi;
