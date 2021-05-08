export interface AdminConfig {
  common: {
    notice: string;
  };

  hatenablog: {
    sender: string;
    limit: string;
    to: string;
  };

  mailjet: {
    key: string;
    secret: string;
  };

  vercelapp: {
    auth: string;
    limit: string;
    brokendata: string;
  };
}
