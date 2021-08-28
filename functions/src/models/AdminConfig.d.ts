export interface AdminConfig {
  common: {
    notice: string;
  };

  jikan: {
    wait: string;
  };

  mailjet: {
    key: string;
    secret: string;
  };

  vercelapp: {
    auth: string;
    brokendata: string;
  };
}
