import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SpiroRapidoAgreement from './build/contracts/SpiroRapidoAgreement.json';
import spiroLogo from './logos/spiro.png';  // Adjust the path according to your folder structure
import rapidoLogo from './logos/rapido.png';

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [spiro, setSpiro] = useState('Not signed');
  const [rapido, setRapido] = useState('Not signed');
  const [spiroDetails, setSpiroDetails] = useState({ name: '', date: '' });
  const [rapidoDetails, setRapidoDetails] = useState({ name: '', date: '' });

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Prompt MetaMask only after login

        const accounts = await web3.eth.getAccounts();
        setCurrentAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SpiroRapidoAgreement.networks[networkId];

        if (deployedNetwork) {
          const instance = new web3.eth.Contract(
            SpiroRapidoAgreement.abi,
            deployedNetwork.address
          );
          setContract(instance);

          const spiroAddress = await instance.methods.spiro().call();
          const rapidoAddress = await instance.methods.rapido().call();
          const spiroSigned = await instance.methods.spiroSigned().call();
          const rapidoSigned = await instance.methods.rapidoSigned().call();

          if (spiroSigned) {
            setSpiro(spiroAddress);
            if (!spiroDetails.date) {
              setSpiroDetails({
                name: 'Spiro',
                date: new Date().toLocaleString(),
              });
            }
          }
          if (rapidoSigned) {
            setRapido(rapidoAddress);
            if (!rapidoDetails.date) {
              setRapidoDetails({
                name: 'Rapido',
                date: new Date().toLocaleString(),
              });
            }
          }
        } else {
          alert('Contract not deployed on this network');
        }
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  };

  const signAsSpiro = async () => {
    try {
      if (!contract) throw new Error('Contract not loaded');
      const agreementHash = prompt('Enter the agreement hash to sign as Spiro:');
      await contract.methods.signAsSpiro(agreementHash).send({ from: currentAccount });
      const spiroAddress = await contract.methods.spiro().call();
      setSpiro(spiroAddress);
      setSpiroDetails({
        name: 'Spiro',
        date: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Error signing as Spiro:', error);
      alert(`Failed to sign as Spiro: ${error.message}`);
    }
  };

  const signAsRapido = async () => {
    try {
      if (!contract) throw new Error('Contract not loaded');
      const agreementHash = prompt('Enter the agreement hash to sign as Rapido:');
      await contract.methods.signAsRapido(agreementHash).send({ from: currentAccount });
      const rapidoAddress = await contract.methods.rapido().call();
      setRapido(rapidoAddress);
      setRapidoDetails({
        name: 'Rapido',
        date: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Error signing as Rapido:', error);
      alert(`Failed to sign as Rapido: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Spiro-Rapido SLA Agreement</h1>
      <button style={styles.button} onClick={loadBlockchainData}>
        Connect Wallet
      </button>
      <p>Current Account: {currentAccount}</p>
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Agreement Details</h2>
        <ul style={styles.list}>
          <li>Both parties will adhere to the agreed SLA conditions.</li>
          <li>40,000 EV bikes will be leased by Spiro to Rapido.</li>
          <li>Rapido will maintain the bikes as per the maintenance guidelines.</li>
          <li>Monthly payments to Spiro are due by the 5th of each month.</li>
          <li>Rapido must provide monthly usage and mileage reports.</li>
          <li>Late payments will incur a 2% penalty per month.</li>
          <li>Spiro will provide service support for technical issues.</li>
          <li>Any disputes will be resolved via arbitration.</li>
          <li>This agreement is valid for a period of 3 years.</li>
          <li>Both parties must give 60 days' notice for termination.</li>
        </ul>
      </div>
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Signatures</h2>
        <div style={styles.signatureRow}>
          <div style={styles.signatureBox}>
            <p>Name: {spiroDetails.name}</p>
            <p>Signature: {spiro}</p>
            <p>Date: {spiroDetails.date}</p>
          </div>
          <div style={styles.signatureBox}>
            <p>Name: {rapidoDetails.name}</p>
            <p>Signature: {rapido}</p>
            <p>Date: {rapidoDetails.date}</p>
          </div>
        </div>
      </div>
      <div style={styles.buttonRow}>
      <button onClick={signAsSpiro} style={styles.button}>
                Counter Sign &nbsp;
                <img src={spiroLogo} alt="Spiro Logo" style={styles.logo} />
              </button>
              <button onClick={signAsRapido} style={styles.button}>
                Counter Sign &nbsp;
                <img src={rapidoLogo} alt="Rapido Logo" style={styles.logo} />
              </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    maxHeight: '100vh',
    overflowY: 'auto', // Enable vertical scrolling
    padding: '20px',
    boxSizing: 'border-box',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionHeader: {
    borderBottom: '2px solid #ccc',
    paddingBottom: '5px',
    marginBottom: '10px',
  },
  list: {
    paddingLeft: '20px',
  },
  signatureRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    backgroundColor: '#f4f4f4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
  },
  logo: {
    width: '20px',
    height: 'auto',
    marginRight: '10px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    marginRight: '10px',
    display: 'flex',
    alignItems: 'center',
  },
};

export default Home;