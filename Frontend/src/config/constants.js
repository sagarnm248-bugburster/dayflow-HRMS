export const STATUS_COLORS = {
  approved: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  present: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  
  pending: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20",
  late: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20",
  
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  absent: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  
  default: "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20"
};

export const getStatusColorClass = (status) => {
  if (!status) return STATUS_COLORS.default;
  const key = status.toLowerCase();
  if (key.includes("approve") || key.includes("present")) return STATUS_COLORS.approved;
  if (key.includes("pending") || key.includes("late")) return STATUS_COLORS.pending;
  if (key.includes("reject") || key.includes("absent")) return STATUS_COLORS.rejected;
  return STATUS_COLORS.default;
};
