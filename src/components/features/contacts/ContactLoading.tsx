
const ContactLoading = () => {
    return (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 animate-pulse mt-6">
            {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: using index as key is acceptable for static list
                <div key={idx} className="border rounded-2xl p-4 bg-white flex flex-col gap-2">
                    {/* Header */}
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>

                    {/* Nomor HP */}
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>

                    {/* Footer */}
                    <div className="flex gap-2 mt-2">
                        <div className="h-6 bg-gray-300 rounded flex-1"></div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                </div>


            ))}
        </div>
    )
}

export default ContactLoading