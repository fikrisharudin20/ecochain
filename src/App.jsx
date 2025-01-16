import React, { useState } from "react";
import Web3 from "web3";
import { AppBar, Toolbar, Typography, Container, Button, Grid, Paper, List, ListItem, ListItemText, TextField } from "@mui/material";

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
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            EcoChain
          </Typography>
          <Button color="inherit" onClick={connectWallet}>
            Connect Wallet
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h4" gutterBottom>
          Welcome to EcoChain
        </Typography>
        <Typography variant="h6" gutterBottom>
          Account: {account}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6">List an Item</Typography>
              <form onSubmit={(e) => { e.preventDefault(); listItem(); }}>
                <TextField
                  label="Item Name"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  margin="normal"
                />
                <TextField
                  label="Item Price"
                  fullWidth
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  margin="normal"
                />
                <Button variant="contained" component="label" fullWidth>
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setItemImage(e.target.files[0])}
                  />
                </Button>
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 16 }}>
                  List Item
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6">Items</Typography>
              <List>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <ListItem key={index}>
                      <img src={item.image} alt={item.name} style={{ width: 50, height: 50, marginRight: 16 }} />
                      <ListItemText primary={item.name} secondary={`Price: ${item.price}`} />
                      <Button variant="contained" color="primary" onClick={() => addToCart(index)}>
                        Add to Cart
                      </Button>
                    </ListItem>
                  ))
                ) : (
                  <Typography>No items listed.</Typography>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
        <section>
          <Typography variant="h6" gutterBottom>
            Cart
          </Typography>
          {cart.length > 0 ? (
            <List>
              {cart.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item.name} secondary={`Price: ${item.price}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>Your cart is empty.</Typography>
          )}
          {cart.length > 0 && (
            <Button variant="contained" color="primary" onClick={buyCart} style={{ marginTop: 16 }}>
              Purchase Items
            </Button>
          )}
        </section>
      </Container>
      <footer style={{ marginTop: 16, padding: 16, textAlign: 'center', backgroundColor: '#f1f1f1' }}>
        <Typography variant="body2" color="textSecondary">
          &copy; 2023 EcoChain. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default App;
