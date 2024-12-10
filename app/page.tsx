import { redirect } from "next/navigation";
import { DEFAULT_PROJECT } from "@/config";

export default function Home() {
  redirect(`/feed/${DEFAULT_PROJECT.slug}`);
}
