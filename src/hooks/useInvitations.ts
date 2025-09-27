import { useQuery } from "@tanstack/react-query";
import { getInvitations } from "@/actions/Invitations";

export function useInvitations() {
    const invitationQuery = useQuery({
        queryKey: ["invitations"],
        queryFn: () => getInvitations()
    })

    return { invitationQuery }
}