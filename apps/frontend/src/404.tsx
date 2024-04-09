import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const errorMessage = (error: unknown): string => {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  console.error(error);
  return 'Unknown error';
};

export const Page404 = () => {
  const error = errorMessage(useRouteError());
  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error}</i>
      </p>
    </div>
  );
};
