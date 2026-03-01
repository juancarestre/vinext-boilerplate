declare module "cloudflare:workers" {
  export const env: {
    API_SERVICE?: {
      fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
    };
  };
}
