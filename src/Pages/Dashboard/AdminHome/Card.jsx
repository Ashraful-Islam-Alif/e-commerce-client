import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";

const iconMap = {
  Customers: <Users className="w-5 h-5 text-blue-500 mr-2" />,
  Products: <Package className="w-5 h-5 text-purple-500 mr-2" />,
  Orders: <ShoppingCart className="w-5 h-5 text-green-500 mr-2" />,
  Revenue: <DollarSign className="w-5 h-5 text-yellow-500 mr-2" />,
};

const Card = ({ title, value }) => (
  <div className="bg-white rounded-2xl shadow p-5">
    <div className="flex items-center gap-2 text-gray-500 font-medium mb-1">
      {iconMap[title] || null}
      <h4>{title}</h4>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Card;
