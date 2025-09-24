export function Progress({ value, className }: { value: number; className?: string }) {
    return (
        <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
            <div
                className="bg-aqua h-2 rounded-full transition-all duration-300"
                style={{ width: `${value}%` }}
            />
        </div>
    )
}
