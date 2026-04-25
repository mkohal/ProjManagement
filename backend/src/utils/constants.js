export const UserRolesEnum = {
  ADMIN: "admin",
  MEMBER: "member",
};

export const AvailableUserRole = Object.values(UserRolesEnum);

export const ProjectStatusEnum = {
  PLANNING: "planning",
  ACTIVE: "active",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
};

export const AvailableProjectStatus = Object.values(ProjectStatusEnum);

export const TaskStatusEnum = {
  TODO: "todo",
  ON_HOLD: "on_hold",
  IN_PROGRESS: "in_progress",
  TESTING: "testing",
  DONE: "done",
};

export const AvailableTaskStatus = Object.values(TaskStatusEnum);
