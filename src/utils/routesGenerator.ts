/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteObject } from "react-router-dom";

// Route Generator Function
export const routeGenerator = (allitems: any[]): RouteObject[] => {
  return allitems.reduce<RouteObject[]>((acc, item) => {
    // If the item has a URL and element, create a route for it
    if (item.url && item.element) {
      const route: RouteObject = {
        path: item.url,
        element: item.element, // Use 'element' to render the route content
      };

      // If there are nested items (subroutes), process them recursively
      if (item.items && item.items.length > 0) {
        const childRoutes = routeGenerator(item.items); // Recursively process nested items
        acc.push(...childRoutes); // Merge child routes into the accumulator
      }

      acc.push(route); // Add the current route to the accumulator
    } else if (item.items && item.items.length > 0) {
      const childRoutes = routeGenerator(item.items); // Process nested items
      acc.push(...childRoutes); // Add all the child routes to the accumulator
    }

    return acc;
  }, []);
};
