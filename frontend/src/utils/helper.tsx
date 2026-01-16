import { subDomainList } from "./constants";

// Define the shape of your configuration objects
// Ideally, this should be exported from "./constant" or a types file
export interface SubDomainConfig {
  main?: boolean;
  subdomain?: string;
  app: string; // If 'app' is an Enum or specific string union, replace 'string' with that type
}

export const getApps = (): string => {
  const subdomain = getSubDomain(window.location.hostname);

  // Cast the imported list to ensure type safety
  const configs = subDomainList as SubDomainConfig[];

  const mainApp = configs.find((app) => app.main);

  // Safety check: ensure a main app actually exists
  if (!mainApp) {
    throw new Error("Main app configuration is missing");
  }

  if (subdomain === "") return mainApp.app;

  const selectedApp = configs.find((app) => subdomain === app.subdomain);

  return selectedApp ? selectedApp.app : mainApp.app;
};

// url.localhost
// url.urlbestshort.com
export const getSubDomain = (location: string): string => {
  const locationParts = location.split(".");
  const isLocalhost = locationParts.slice(-1)[0] === "localhost";
  const sliceTill = isLocalhost ? -1 : -2;

  return locationParts.slice(0, sliceTill).join("");
};