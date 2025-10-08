"use client"

import { useState } from "react"
import { useInvitations } from "@/hooks/useInvitations"
import { cn } from "@/lib/utils"
import { session } from "../../../../auth-schema"
import Search from "../../ui/Search"
import CardTamu from "./CardTamu"
import FilterButton from "./FilterButton"
import ViewModeButton from "./ViewModeButton"

const TabInvitations = () => {

    const { invitationQuery, isPending } = useInvitations()
    const template = invitationQuery?.templates
    const contacts = invitationQuery?.contacts

    if (!session) {
        window.location.href = "/login";
    }

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [query, setQuery] = useState<string>("")
    const [filter, setFilter] = useState("all")

    const filteredContact = contacts?.filter(contact => {
        let matchFilter = true
        const q = query.trim()
        const matchSearch = contact.name.toLowerCase().includes(q.toLowerCase())
        if (filter === "diundang") matchFilter = contact.isInvited === true
        if (filter === "belum") matchFilter = contact.isInvited === false
        return matchFilter && matchSearch
    })


    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-0">
                <div className="flex gap-x-2">
                    <Search
                        id="search-invitation"
                        placeholder="Cari nama tamu undangan..."
                        className="sm:w-64"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <FilterButton value={filter} onChange={setFilter} />
                </div>
                <div className="view-mode">
                    <ViewModeButton viewMode={viewMode} setViewMode={setViewMode} />
                </div>
            </div>

            <div className={cn(
                "grid mt-6 px-4 sm:px-0 gap-4 md:gap-6",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            )}>
                {isPending && [1, 2, 3, 4, 5, 6].map((key) => (
                    <InvitationCardLoading key={key} />
                ))}
                {filteredContact?.map(contact => (
                    <CardTamu
                        key={contact.id}
                        variant={viewMode}
                        contact={{
                            ...contact,
                            phone: contact.phone ?? "08xxxxxxx"
                        }}
                        message={template?.content ?? ""}
                        variables={Array.isArray(template?.variables) ? template.variables : [{ key: "", value: null }]}
                    />
                ))}
            </div>

        </>
    )
}

export const InvitationCardLoading = () => (
    <div className="flex flex-col border rounded-md p-6 animate-pulse">
        <div className="flex justify-between items-start">
            <div>
                <div className="h-4 w-50 rounded-sm bg-gray-200 mb-3"></div>
                <div className="h-4 w-32 rounded-sm bg-gray-200"></div>
            </div>
            <div className="h-6 w-22 rounded-2xl bg-gray-200"></div>
        </div>
        <div className="mt-7 h-12 rounded-lg border flex justify-between items-center px-4">
            <div className="h-4 w-42 rounded-sm bg-gray-200"></div>
            <div className="size-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex gap-4 mt-6">
            <div className="h-8 rounded-sm flex-1 bg-gray-200"></div>
            <div className="h-8 rounded-sm flex-1 bg-gray-200"></div>
        </div>
    </div>
)

export default TabInvitations