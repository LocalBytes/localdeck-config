import { innerPathFromReferrer } from "../../utils/ha-referrer";

export default defineEventHandler((event) => {
  if (event.path !== "/") return;

  const prefix = process.env.LB_PUBLIC_BASE_URL;
  if (!prefix) return;

  const referrer = getRequestHeader(event, "referer");
  if (!referrer) return;

  const innerPath = innerPathFromReferrer(referrer, prefix);
  if (!innerPath || innerPath === "/") return;

  return sendRedirect(event, prefix + innerPath);
});
