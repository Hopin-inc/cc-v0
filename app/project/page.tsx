import { redirect } from "next/navigation";
import { DEFAULT_PROJECT } from "@/config";

export default function Project() {
  redirect(`/p/${DEFAULT_PROJECT.slug}`);
}
