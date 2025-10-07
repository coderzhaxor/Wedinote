import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getInvitations, updateInvitationContact, updateInviteOnCopy } from "@/actions/Invitations";

export function useInvitations() {
    const queryClient = useQueryClient()

    const { data: invitationQuery, refetch: refetchInvitations, isPending } = useQuery({
        queryKey: ["invitations"],
        queryFn: () => getInvitations()
    })


    const updateInviteMutation = useMutation({
        mutationFn: ({ id }: { id: number }) => updateInvitationContact(id),
        onSuccess: (updatedContact) => {
            queryClient.invalidateQueries({ queryKey: ["invitations"] })
            toast.success(`Status ${updatedContact[0].name} Berhasil Di Update`)
        }
    })

    const updateOnCopy = useMutation({
        mutationFn: ({ id }: { id: number }) => updateInviteOnCopy(id),
        onSuccess: (updatedContact) => {
            queryClient.invalidateQueries({ queryKey: ["invitations"] })
            toast.success(`Pesan untuk ${updatedContact[0].name} berhasil disalin dan status undangan otomatis diundang`)
        }
    })

    return { invitationQuery, updateInviteMutation, updateOnCopy, refetchInvitations, isPending }
}

