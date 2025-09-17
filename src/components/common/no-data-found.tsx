interface NoDataFoundProps {
  message?: string
}

const NoDataFound = ({ message = "No data found." }: NoDataFoundProps) => {

  return (
    <div className="flex flex-col items-center justify-center mt-30 py-8 space-y-4 text-gray-700">
      <p className="text-center text-lg font-medium">{message}</p>
    </div>
  )
}

export default NoDataFound
