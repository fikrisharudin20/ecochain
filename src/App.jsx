import React, { useState } from "react";
import Web3 from "web3";

const App = () => {
  const [account, setAccount] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      alert("MetaMask not found. Please install it.");
    }
  };

  const listItem = async () => {
    if (!itemName || !itemPrice || !itemImage) {
      alert("Please fill all fields.");
      return;
    }

    const imageUrl = URL.createObjectURL(itemImage);
    const newItem = { name: itemName, price: itemPrice, image: imageUrl, sold: false };
    setItems([...items, newItem]);
    setItemName("");
    setItemPrice("");
    setItemImage(null);
    alert("Item listed successfully on the blockchain!");
  };

  const addToCart = (index) => {
    const item = items[index];
    if (!item.sold) {
      setCart([...cart, item]);
      setTotalPrice(totalPrice + parseFloat(item.price));
    } else {
      alert("Item is already sold.");
    }
  };

  const buyCart = async () => {
    if (!account) {
      alert("Connect your wallet first.");
      return;
    }

    const updatedItems = [...items];
    cart.forEach((item) => {
      const index = items.indexOf(item);
      updatedItems[index].sold = true;
    });
    setItems(updatedItems);
    setCart([]);
    setTotalPrice(0);
    alert("Items purchased successfully!");
  };

  return (
    <div className="App" style={{ textAlign: "center", padding: "20px" }}>
      <header style={{ backgroundColor: "#282c34", padding: "10px", color: "white" }}>
        <h1>Decentralized E-commerce Platform</h1>
        <button onClick={connectWallet} style={{ marginTop: "10px", padding: "10px" }}>
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
      </header>

      <main style={{ marginTop: "20px" }}>
        <section>
          <h2>Sell an Item</h2>
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            style={{ margin: "5px", padding: "10px" }}
          />
          <input
            type="number"
            placeholder="Price (ETH)"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            style={{ margin: "5px", padding: "10px" }}
          />
          <input
            type="file"
            onChange={(e) => setItemImage(e.target.files[0])}
            style={{ margin: "5px", padding: "10px" }}
          />
          <button onClick={listItem} style={{ margin: "5px", padding: "10px" }}>
            List Item
          </button>
        </section>

        <section style={{ marginTop: "40px" }}>
          <h2>Marketplace</h2>
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  margin: "10px",
                  borderRadius: "5px",
                  display: "inline-block",
                  textAlign: "left",
                  width: "200px",
                }}
              >
                <img src={item.image} alt={item.name} style={{ width: "100%" }} />
                <h3>{item.name}</h3>
                <p>Price: {item.price} ETH</p>
                <p>Status: {item.sold ? "Sold" : "Available"}</p>
                {!item.sold && (
                  <>
                    <button onClick={() => addToCart(index)} style={{ padding: "5px" }}>
                      Add to Cart
                    </button>
                    <button onClick={() => buyItem(index)} style={{ padding: "5px", marginLeft: "5px" }}>
                      Buy Now
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No items listed yet.</p>
          )}
        </section>

        <section style={{ marginTop: "40px" }}>
          <h2>Shopping Cart</h2>
          {cart.length > 0 ? (
            <>
              {cart.map((item, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    margin: "10px",
                    borderRadius: "5px",
                    display: "inline-block",
                    textAlign: "left",
                    width: "200px",
                  }}
                >
                  <img src={item.image} alt={item.name} style={{ width: "100%" }} />
                  <h3>{item.name}</h3>
                  <p>Price: {item.price} ETH</p>
                </div>
              ))}
              <p>Total Price: {totalPrice.toFixed(2)} ETH</p>
              <button onClick={buyCart} style={{ padding: "10px" }}>
                Buy All
              </button>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
