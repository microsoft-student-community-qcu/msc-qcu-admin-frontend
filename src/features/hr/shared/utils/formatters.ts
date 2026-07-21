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

export function formatCampus(campus?: string | null): string {
  if (!campus) return "";
  switch (campus) {
    case "SAN_BARTOLOME_MAIN":
      return "San Bartolome (Main)";
    case "SAN_FRANCISCO":
      return "San Francisco";
    case "BATASAN":
      return "Batasan";
    default:
      return campus;
  }
}

export function formatGender(gender?: string | null): string {
  if (!gender) return "";
  switch (gender) {
    case "MALE":
      return "Male";
    case "FEMALE":
      return "Female";
    case "LGBTQIA":
      return "LGBTQIA+";
    case "PREFER_NOT_TO_SAY":
      return "Prefer not to say";
    default:
      return gender;
  }
}
