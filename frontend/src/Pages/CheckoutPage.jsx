import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetCart } from "@/features/CartSlice";
import { fetchGetAddress, fetchDeleteAddress } from "@/features/AddressSlice";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash } from "lucide-react";

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(fetchGetCart());
      dispatch(fetchGetAddress());
    }
  }, [dispatch]);

  const getCart = useSelector((state) => state.cart.getCart) || [];
  const getAddress = useSelector((state) => state.address.getAddress) || [];
  const getCartStatus = useSelector((state) => state.cart.getCartStatus);
  const totalPrice = getCart.reduce((total, item) => {
    if (item.quantity > 0) {
      return total + item.price * item.quantity;
    }
    return total;
  }, 0);
  const [address, setAddress] = useState(null);

  const shippingPrice = totalPrice > 2000 ? 0 : 200;

  return (
    <div className="w-[95%] mx-auto bg-inherit border-2 mt-8 rounded-lg space-x-4">
      <h1 className="text-2xl font-bold text-center my-4">Order Summary</h1>
      <div className="flex-grow lg:flex ">
        <div className="w-[95%] lg:w-4/6 space-y-2 mb-4 m-2 border-2 rounded-lg p-4">
          {getAddress.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold">Select Address</h2>
              <div className="w-[95%] mx-auto">
                <RadioGroup>
                  {getAddress.map((address) => (
                    <div
                      className="flex flex-row items-center space-x-4 border-2 p-3 rounded-lg"
                      key={address.id}
                    >
                      <RadioGroupItem
                        value={address.id}
                        id={address.id}
                        onClick={() => setAddress(address.id)}
                      />
                      <div className="w-[95%] flex-grow md:flex justify-between text-sm md:text-base space-y-2">
                        <div>
                          <p>House No: {address.house_no} </p>
                          <p>LandMark: {address.landmark} </p>
                        </div>
                        <div>
                          <p>City: {address.city} </p>
                          <p>State: {address.state} </p>
                        </div>
                        <div>
                          <p>Pincode: {address.pincode} </p>
                          <p>Country: {address.country} </p>
                        </div>
                        <div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              dispatch(fetchDeleteAddress(address.id))
                            }
                          >
                            <Trash />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                <Button
                  onClick={() => navigate("/address")}
                  className="w-full mt-4"
                >
                  Create new address
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Add Address</h2>
              <p>You don't have any address you can create one</p>
              <Button onClick={() => navigate("/address")}>Add Address</Button>
            </>
          )}
          <div>
            <h1 className="text-xl font-semibold">Items</h1>
            {getCart.map((item) => (
              <>
                {item.quantity > 0 && (
                  <div
                    key={item.id}
                    className="w-[95%] mx-auto flex-grow lg:flex justify-center lg:justify-between items-center border-2 p-2 rounded-lg my-4 space-y-2 text-center"
                  >
                    <Link to={`/product/${item.product}`}>
                      <img
                        className="w-24 h-20 object-cover rounded-lg mx-auto lg:mx-0"
                        src={item.image}
                        alt={item.name}
                      />
                    </Link>
                    <Link to={`/product/${item.product}`}>
                      <p className="lg:truncate font-semibold w-56 mx-auto lg:mx-0 hover:underline">
                        {item.name}
                      </p>
                    </Link>
                    <p className="font-semibold">₹{item.price}</p>
                    <p className="font-semibold">Quantity: {item.quantity}</p>
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
        <div className="w-[95%] lg:w-2/6 space-y-2 border-2 rounded-lg p-4 m-2 mb-4">
          <h1 className="text-xl font-semibold text-center">Place Order</h1>
          <div className="w-[95%] mx-auto">
            <p className="font-semibold">Total Price: ₹ {totalPrice}</p>
            <p className="font-semibold">
              Shipping: {shippingPrice > 0 ? "₹ 200" : "Free"}
            </p>
            <p className="font-semibold">
              Total: ₹ {totalPrice + shippingPrice}
            </p>
            <Button className="w-full mt-4"> Place Order</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
