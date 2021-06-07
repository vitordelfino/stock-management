declare namespace Express {
  interface Request {
    id: string;
    fromIp: string;
    user: {
      _id: string;
      document: string;
      name: string;
      profile: string;
    };
  }
}
