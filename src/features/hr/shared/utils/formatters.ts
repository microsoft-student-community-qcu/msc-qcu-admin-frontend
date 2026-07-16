export function formatApplicantName(
  firstName?: string | null,
  lastName?: string | null,
  middleInitial?: string | null
): string {
  const f = (firstName || "").trim();
  const l = (lastName || "").trim();
  const m = (middleInitial || "").trim();

  let name = "";
  if (l && f) {
    name = `${l}, ${f}${m ? " " + m : ""}`;
  } else if (f) {
    name = `${f}${m ? " " + m : ""}`;
  } else if (l) {
    name = l;
  }
  return name.trim().replace(/\s+/g, ' ');
}
