export type ErrorType = {
  message: string;
  data: { status: number; errorMessage?: string | {} };
};
function HttpError(data: ErrorType) {
  return Error(data.message, { cause: data.data });
}

function isErrorOfType(error: any): error is ErrorType {
  return (
    typeof error === "object" &&
    "message" in error &&
    "data" in error &&
    typeof error.data === "object" &&
    "status" in error.data &&
    typeof error.data.status === "number"
  );
}

export default { HttpError, isErrorOfType };
