"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { contacts } from "@/lib/contacts"
import FilterButton from "./FilterButton"
import Search from "../../ui/Search"
import ViewModeButton from "./ViewModeButton"
import CardTamu from "./CardTamu"

const TabInvitations = () => {

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [query, setQuery] = useState<string>("")
    const [filter, setFilter] = useState("all")

    const filteredContact = contacts.filter(contact => {
        let matchFilter = true
        const q = query.trim()
        const matchSearch = contact.name.toLowerCase().includes(q.toLowerCase())
        if (filter === "diundang") matchFilter = contact.status === true
        if (filter === "belum") matchFilter = contact.status === false
        return matchFilter && matchSearch
    })

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-0">
                <div className="flex gap-x-2">
                    <Search
                        id="search-invitation"
                        placeholder="Cari nama tamu undangan..."
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
                "grid mt-6",
                viewMode === "grid" ? "gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 px-4" : "grid-cols-1 px-4 gap-4 md:gap-6"
            )}>
                {filteredContact.map(contact => (
                    <CardTamu key={contact.id} variant={viewMode} contact={contact} />
                ))}
            </div>

        </>
    )
}

export default TabInvitations