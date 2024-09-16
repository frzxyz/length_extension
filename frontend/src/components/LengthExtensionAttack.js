import React, { useState } from 'react';
import axios from 'axios';

const LengthExtensionAttack = () => {
  const [step, setStep] = useState(0);
  const [originalURL] = useState("https://uploads.dailydot.com/2018/10/olli-the-polite-cat.jpg?auto=compress&fm=pjpg");
  const [additionalData] = useState("&file=valuable");
  const [originalHash, setOriginalHash] = useState('');
  const [newHash, setNewHash] = useState('');
  const [extendedURL, setExtendedURL] = useState('');
  const [paddedMessage, setPaddedMessage] = useState('');
  const [attackSuccess, setAttackSuccess] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');
  const [freeImageUrl] = useState("https://uploads.dailydot.com/2018/10/olli-the-polite-cat.jpg?auto=compress&fm=pjpg");
  const [valuableImageDisabled] = useState("https://i.imgur.com/MpcQcDE.jpeg");
  const [valuableImageLink] = useState("https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg");
  const [secretKey] = useState("supersecretkey"); // Secret Key

  // Function to start the attack process step-by-step
  const startAttackProcess = async () => {
    setStep(1);

    // Step 1: Show original URL and its hash
    setTimeout(async () => {
      setOriginalHash("Generating hash...");

      const response = await axios.post('http://localhost:5000/api/get-original-hash', {
        originalMessage: originalURL
      });

      setOriginalHash(response.data.originalHash); // Set original hash
      setStep(2);
    }, 1000);  // Simulate delay for process
  };

  // Function to append data and calculate the new hash
  const extendURL = async () => {
    setStep(3);

    // Step 2: Show the append process
    setTimeout(() => {
      const extended = originalURL + additionalData;
      setExtendedURL(extended);

      // Calculate padding (assuming SHA-256 padding)
      const messageLength = originalURL.length * 8; // Message length in bits
      const paddingBits = (512 - ((messageLength + 64) % 512)) % 512; // Calculate padding bits
      const paddingBytes = paddingBits / 8; // Convert to bytes

      // Create a padded message (hex representation)
      const paddedURL = extended + "80" + "0".repeat(paddingBytes * 2) + messageLength.toString(16);
      setPaddedMessage(paddedURL);

      setStep(4);
    }, 1000); // Simulate delay for showing append process
  };

  // Function to calculate the new hash and simulate the attack
  const calculateNewHash = async () => {
    setStep(5);
    setNewHash("Calculating new hash...");

    setTimeout(async () => {
      const response = await axios.post('http://localhost:5000/api/simulate-length-extension', {
        additionalData
      });

      setNewHash(response.data.newHash);
      setStep(6);

      setAttackSuccess(response.data.success);
      if (response.data.success) {
        setImageUrl(valuableImageLink); 
        setDownloadLink(`${valuableImageLink}?hash=${response.data.newHash}&padded_message=${paddedMessage}`);
      }
    }, 1000);
  };

  return (
    <div className="attack-demo">
      <h2>Length Extension Attack Demo (with Secret Key and Padding)</h2>

      {step === 0 && (
        <div>
          <a href={freeImageUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={freeImageUrl}
              alt="Free content"
              style={{ width: '300px' }}
            />
          </a>
          <p>This is the free content available without attack.</p>

          <div>
            <p>The valuable content is currently disabled:</p>
            <img
              src={valuableImageDisabled}
              alt="Disabled valuable content"
              style={{ width: '300px', opacity: '0.5' }}
            />
            <div> </div>
            <button disabled>Download Valuable Content</button>
          </div>
          <button onClick={startAttackProcess}>Start Length Extension Attack</button>
        </div>
      )}

      {step >= 1 && (
        <div>
          <h3>Step 1: Original URL</h3>
          <p><strong>URL:</strong> {originalURL}</p>
          <p><strong>Original Hash:</strong> {originalHash}</p>
          <p><strong>Secret Key:</strong> {secretKey}</p>
          <p><strong>Hash Calculation:</strong> <code>{secretKey} + {originalURL}</code></p> {/* Display how the hash is calculated */}
        </div>
      )}

      {step >= 2 && (
        <div>
          <h3>Step 2: Appending Data</h3>
          <p><strong>Data to Append:</strong> {additionalData}</p>
          <button onClick={extendURL}>Append Data</button>
        </div>
      )}

      {step >= 3 && (
        <div>
          <h3>Step 3: Extended URL and Padding</h3>
          <p><strong>Extended URL:</strong> {extendedURL || 'Appending data...'}</p>
          <p><strong>Padded URL (Hex):</strong> {paddedMessage || 'Calculating padding...'}</p>
          <button onClick={calculateNewHash}>Calculate New Hash</button>
        </div>
      )}

      {step >= 5 && (
        <div>
          <h3>Step 4: New Hash</h3>
          <p><strong>New Hash:</strong> {newHash}</p>
        </div>
      )}

      {step === 6 && (
        <div>
          <h3>Step 5: Result of Attack</h3>
          {attackSuccess ? (
            <div>
              <h4>Attack Successful!</h4>
              <p>The valuable image is now available:</p>
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  alt="Valuable content"
                  style={{ width: '300px' }}
                />
              </a>
              <div> </div>
              <button>
                <a href={downloadLink} target="_blank" rel="noopener noreferrer">Download Valuable Content</a>
              </button>
            </div>
          ) : (
            <div>
              <h4>Attack Failed</h4>
              <p>You were unable to access the admin-only image.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LengthExtensionAttack;
