interface PricingDetails {
  price: number;
  adminFee: number;
  totalPrice: number;
}

const PriceDetails = ({ price }: { price: number }) => {

  return (
    <div className="bg-white rounded-lg pt-6 pb-0">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h4>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price</span>
          <span className="text-gray-900 font-bold">$ {price}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
