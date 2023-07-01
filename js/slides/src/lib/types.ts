import { JSX } from "solid-js";

export type Page = (() => JSX.Element) & {
  /**
   * The path template for the page. ex: `() => "/posts/:id"`
   */
  template: () => string;
  /**
   * The path function for the page. ex: `(id: string) => "/posts/" + id`
   */
  path: <T extends any[]>(...args: T) => string;
};
