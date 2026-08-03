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

export function formatOffice(office?: string | null): string {
  if (!office) return "";
  const mappings: Record<string, string> = {
    "EXECUTIVE_COMMITTEE": "Executive Committee",
    "MANAGEMENT_AND_DEVELOPMENT_OFFICE": "Management and Development Office",
    "MARKETING_AND_COMMUNICATIONS_OFFICE": "Marketing and Communications Office",
    "SECRETARIAT_OFFICE": "Secretariat Office",
    "FINANCE_OFFICE": "Finance Office",
    "AUDIT_OFFICE": "Audit Office",
    "LOGISTICS_OFFICE": "Logistics Office",
    "TECHNICAL_AND_INNOVATIONS_OFFICE": "Technical and Innovations Office",
    "CREATIVES_AND_DESIGN_OFFICE": "Creatives and Design Office",
    "MULTIMEDIA_ARTS_AND_PRODUCTIONS_OFFICE": "Multimedia Arts and Productions Office",
    "HUMAN_RESOURCES_OFFICE": "Human Resources Office",
  };
  return mappings[office] || office.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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
