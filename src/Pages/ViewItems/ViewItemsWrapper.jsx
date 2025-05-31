import { useOutletContext } from "react-router-dom";
import ViewItems from "./ViewItems";

const ViewItemsWrapper = () => {
  const { cartItems, updateQuantity, deleteItem } = useOutletContext();

  return (
    <ViewItems
      cartItems={cartItems}
      updateQuantity={updateQuantity}
      deleteItem={deleteItem}
    />
  );
};

export default ViewItemsWrapper;
