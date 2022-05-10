import { Button, Container, Input, Text, Textarea } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Head from "next/head";

import abi from "../utils/BuyMeACoffee.json";

export default function Home() {
  const contractAddress = "0x38eBdd7Eac57B430F5c5a723B91590865cd1AF49";
  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyCoffee = async (value) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..");
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther(value) }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getMemos = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const buyMeACoffee = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          console.log("fetching memos from the blockchain..");
          const memos = await buyMeACoffee.getMemos();
          console.log("fetched!");
          setMemos(memos);
        } else {
          console.log("Metamask is not connected");
        }
      } catch (error) {
        console.log(error);
      }
    };

    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name,
        },
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    };
  }, [contractABI]);

  return (
    <>
      <Head>
        <title>Anish De | BuyMeAMac on Goerli</title>
        <meta
          name="description"
          content="App as part of a course that lets one buy me a mac on the Goerli testnet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container
        as="main"
        css={{
          position: "relative",
          marginLeft: "auto",
          marginRight: "auto",
          maxW: "48rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "6rem",
          marginBottom: "6rem",
        }}
      >
        <Text h1 css={{ marginBottom: "1rem" }}>
          Buy Anish a Mac
        </Text>

        {currentAccount ? (
          <Container
            as="form"
            css={{ display: "flex", flexDirection: "column" }}
          >
            <Container css={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                onChange={onNameChange}
                css={{ marginTop: "0.5rem", marginBottom: "1rem" }}
              />
            </Container>
            <Container css={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="message">Message</label>
              <Textarea
                rows={3}
                placeholder="You are awesome!"
                onChange={onMessageChange}
                required
                css={{ marginTop: "0.5rem", marginBottom: "1rem" }}
              />
            </Container>

            <Button
              type="button"
              onClick={() => buyCoffee("0.001")}
              css={{ marginTop: "1rem" }}
            >
              Send M1 MacBook Air 8/256 for 0.001 ETH
            </Button>

            <Button
              type="button"
              onClick={() => buyCoffee("0.003")}
              css={{ marginTop: "1rem" }}
            >
              Send M1 Max MacBook Pro 64/1TB for 0.003 ETH
            </Button>

            <Button
              type="button"
              onClick={() => buyCoffee("0.005")}
              css={{ marginTop: "1rem" }}
            >
              Send M1 Ultra Mac Studio 128/2TB for 0.005 ETH
            </Button>
          </Container>
        ) : (
          <Button onClick={connectWallet}>Connect Metamask</Button>
        )}

        {currentAccount && (
          <Text h2 css={{ marginTop: "2rem", marginBottom: "1rem" }}>
            Memos received
          </Text>
        )}

        {currentAccount &&
          memos.map((memo, idx) => (
            <Container
              key={idx}
              css={{
                background: "$backgroundContrast",
                borderRadius: "$sm",
                marginTop: "0.5rem",
                padding: "1rem, 2rem",
              }}
            >
              <Text css={{ marginTop: "0.5rem" }}>{memo.message}</Text>
              <Text>
                From {memo.name} at {memo.timestamp.toString()}
              </Text>
            </Container>
          ))}
      </Container>
    </>
  );
}
