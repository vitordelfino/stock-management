declare module 'express-request-id' {
  type Response = (request, response, next) => void;
  export default function (): Response;
}
