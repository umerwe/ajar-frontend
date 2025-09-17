
const MostMentionedTabs = () => {
    return (
        <div className="mb-6" >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Most Mentioned</h3>
            <div className="flex flex-wrap gap-2">
                {/* {property.mostMentioned.map((item) => (
                    <button
                        key={item.label}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                    >
                        {item.label} ({item.count})
                    </button>
                ))} */}
            </div>
        </div >
    )
}

export default MostMentionedTabs
