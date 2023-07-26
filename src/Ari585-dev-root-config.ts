import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";

// Define las aplicaciones y el orden en que deseas cargarlas
const appsInOrder = [
  {
    name: "@Ari585-dev/mf-presentation",
    app: () => System.import("@Ari585-dev/mf-presentation"),
    activeWhen: () => true, // Siempre activo
    customProps: { data: "some custom props data for mf-presentation" },
  },
  {
    name: "@Ari585-dev/mf-technologies",
    app: () => System.import("@Ari585-dev/mf-technologies"),
    activeWhen: () => true, // Siempre activo
    customProps: { data: "some custom props data for mf-technologies" },
  },
  {
    name: "@Ari585-dev/mf-blogsandprojects",
    app: () => System.import("@Ari585-dev/mf-blogsandprojects")
      .then((module) => module.default), // Asegurar que retornamos la función 'bootstrap', 'mount', 'unmount'
    activeWhen: () => true, // Siempre activo
    customProps: { data: "some custom props data for mf-blogsandprojects" },
  },
  // Puedes agregar más microfrontends aquí en el orden deseado
];

// Construye las rutas a partir del layout del microfrontend
const routes = constructRoutes(microfrontendLayout);

// Construye las aplicaciones en el orden establecido
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});

// Registra las aplicaciones en el orden definido
const registrationPromises = appsInOrder.map((app) => {
  const customProps = app.customProps || {};
  return registerApplication({
    name: app.name,
    app: app.app,
    activeWhen: app.activeWhen, // Agregamos la función activeWhen correspondiente
    customProps: customProps,
  });
});

// Esperar a que todas las aplicaciones se registren antes de activar el enrutador
Promise.all(registrationPromises).then(() => {
  const layoutEngine = constructLayoutEngine({ routes, applications });
  layoutEngine.activate();
  start();
});
