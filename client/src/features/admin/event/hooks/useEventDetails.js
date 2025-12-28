import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchEventBySlug } from "../services/event.service";

export const useEventDetails = () => {
  const { slug } = useParams();

  return useQuery({
    queryKey: ["admin-event", slug],
    queryFn: () => fetchEventBySlug(slug),
    enabled: !!slug,
  });
};