interface PricingDetails {
  price: number;
  adminFee: number;
  totalPrice: number;
}

const PriceDetails = ({ pricingDetails }: { pricingDetails: PricingDetails }) => {
  return (
    <div className="bg-white rounded-lg pt-6 pb-0">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h4>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">1 room x 1 night</span>
          <span className="text-gray-900">Rs {pricingDetails.price}</span>
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Taxes & fees</span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <span className="text-gray-900">Rs {pricingDetails.adminFee}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-custom">
          <div className="flex items-center gap-1">
            <span>VAT</span>
          </div>
          <span>Rs 5,038.89</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Special Discount</span>
          <span className="text-aqua">-Rs 2,760.06</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Prepay Online</span>
            <div className="text-right font-bold text-xl text-gray-900">
              <div>Rs</div>
              <div>{pricingDetails.totalPrice}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
