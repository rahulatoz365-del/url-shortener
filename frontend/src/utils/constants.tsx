import React from 'react';
import AppRouter, { SubDomainRouter } from "../AppRouter";

// Define the interface to enforce structure and types
export interface SubDomainConfig {
    subdomain: string;
    // generic <any> is used here assuming the routers might not share exact props,
    // or take no props. You can be more specific if they share a specific Prop interface.
    app: React.ComponentType<any>;
    main: boolean;
}

export const subDomainList: SubDomainConfig[] = [
    { subdomain: "www", app: AppRouter, main: true },
    { subdomain: "url", app: SubDomainRouter, main: false }
];