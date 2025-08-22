import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";


export default function App() {
  const [Option, setOption] = useState("Yes");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [Birth, setBirth] = useState(""); 
  const [Age, setAge] = useState("");
  const[phoneNumber, setphoneNumber] = useState("");
  const [idNumber, setidNumber] = useState("")
  const [emergencyName, setEmergencyName] = useState("");
  const [relationship, setRelationship] = useState("");
  const[emergencyNumber, setemergencyNumber] = useState("");
  const [Health, setHealth] = useState({
    bloodborne: false,
    diabetes: false,
    skin: false,
    latex: false,
    heart: false,
    bloodclott: false,
    epilepsy: false,
    pregnant:false,
    none: false,
  });
  const [Explain, setExplain] = useState("");
  const [Influence, setInfluence] = useState(""); 
  const[savedSignature, setSavedSignature] = useState(null); 
  const signatureRef =  useRef(null); 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [Email, setEmail] = useState(""); 

  const formattedDate = currentDate.toLocaleDateString();
  



  const handleName = (e) => {
    setName(e.target.value);
    if (error && e.target.value) {
      setError("");
    }
  };

  const handleBirth = (e) => {
    setBirth(e.target.value);
  };

  const handleAge = (e) => {
    const value = e.target.value;
    const intAge = parseInt(value, 10);

    if (!isNaN(intAge)){
      setAge(intAge);
    } else {
      alert('Please enter your age');
      setAge(0); 
    }
  };

  const handlephoneNumber = (e) => {
    setphoneNumber(e.target.value);
  };

  const validatePhone = (e) => {
    const phoneRegex = /^\d{10}$|^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      alert("Enter a valid number");
    }
  }

  const handleidNumber = (e) => {
    const idValue = e.target.value.trim();
    const idRegex = /^[a-zA-Z0-9]*$/;

    if(idRegex.test(idValue)) {
      setidNumber(idValue);
    } else {
      alert("Enter valid id number")
    }
  };
  const handleEmergencyName = (e) => setEmergencyName(e.target.value);
  const handleRelationship = (e) => setRelationship(e.target.value);  

  const handleEmergencyNumber = (e) => {
    setemergencyNumber(e.target.value.trim()); 
  };

  const validateEmergencyNumber = (e) => {
    const emergencyphoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    if (!emergencyphoneRegex.test(emergencyNumber.trim())) {
      alert("Enter a valid number");
    }
  };

  const handleHealthCheck = (e) => {
    const { name, checked} = e.target; 
    setHealth((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleExplain = (e) => setExplain(e.target.value);

  const handleInfluence = (e) => setInfluence(e.target.value);

  const clearSignature =  () => {
    signatureRef.current.clear(); 
  } 

  const saveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataURL = signatureRef.current.toDataURL("image/png");
      setSavedSignature(dataURL);
      alert("Signature saved!");
    } else {
      alert("Please provide a signature first.");
    }
  };

  const getHealthSelections = () => {
    if (Health.none){
      return "N/A"; 
    }
    const selected = Object.keys(Health)
      .filter((key) => Health[key]) // keep only checked
      .map((key) => key.charAt(0).toUpperCase() + key.slice(1));
  
    return selected.length > 0 ? selected.join(", ") : "None";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60 * 1000); 

    return () => clearInterval(interval); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!name.trim()) {
      setError("You are missing one or more requirements");
      return;
    }
  
    try {
      let signatureURL = savedSignature; 
      
      // Get signature as Base64
      if (!signatureURL && signatureRef.current && !signatureRef.current.isEmpty()) {
        signatureURL = signatureRef.current.toDataURL("image/png");
      }


      const getData = {
        name: name.trim(),
        email: Email.trim(),
        birthDate: Birth.trim(),
        phoneNumber: phoneNumber.trim(),
        idNumber: idNumber.trim(),
        emergencyContact: {
          name: emergencyName.trim(),
          relationship: relationship.trim(),
          phoneNumber: emergencyNumber.trim(),
        },
        consent: {
          underInfluence: Influence,
          atLeast18: Option,
        },
        explanation: Option === "Yes" ? Explain.trim() : null,
        health: getHealthSelections(), 
        signature: signatureURL,
        date: formattedDate,
      };
  

      const templateParams = {
        name: getData.name,
        birthDate: getData.birthDate,
        phoneNumber: getData.phoneNumber,
        idNumber: getData.idNumber,
        emergencyContactName: getData.emergencyContact.name,
        emergencyContactRelationship: getData.emergencyContact.relationship,
        emergencyContactPhone: getData.emergencyContact.phoneNumber,
        underInfluence: getData.consent.underInfluence,
        atLeast18: getData.consent.atLeast18,
        explanation: getData.explanation || "None",
        date: getData.date,
        signature:signatureURL,
        healthSelections: getData.health
      };
  

      const response = await fetch("https://proxy-tattoo-server.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateParams }),
      });

      const result = await response.json();
    if (result.success) {
      alert("Form submitted successfully!");
    } else {
      alert("Error sending form: " + result.error);
    }
  

      setName("");
      setBirth("");
      setAge("");
      setphoneNumber("");
      setidNumber("");
      setEmergencyName("");
      setRelationship("");
      setemergencyNumber("");
      setError("");
      setHealth({
        bloodborne: false,
        diabetes: false,
        skin: false,
        latex: false,
        heart: false,
        bloodclott: false,
        epilepsy: false,
        pregnant: false,
        none: false,
      });
      setExplain("");
      setInfluence("");
      if (signatureRef.current) signatureRef.current.clear();
      setSavedSignature(null); 

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  const handleOption = (e) => {
    setOption(e.target.value);
  };

  function QRCodeGenerator() {
    const formURL = "https://proxy-tattoo-server.onrender.com"; 
  
    return (
      <div>
        <h3>Scan to Open Form</h3>
        <QRCode value={formURL} size={256} />
      </div>
    );
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ fontFamily: "Dancing Script", fontWeight: "bold" }}>
          Tatted By Cam🖊️
        </h1>
      </header>

      <div className="App-content">
        <form onSubmit={handleSubmit}>

          <div className="Client-heading">
            <h2>Client Information</h2>
            </div>



          {/* Name Section */}
          <div className="Name-section">
            <label htmlFor="Name">Full Name: </label>
            <input
              type="text"
              id="Name"
              value={name}
              onChange={handleName}
              required
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          {/* DOB Section */}
          <div className="Birth-section">
            <label htmlFor="dob">Date of Birth:</label>
            <input type="date" id="Birth" value={Birth} onChange={handleBirth} required>
            </input>
          </div>

          {/* Age section */}
          <div className="Age-section">
            <label htmlFor="Age">Age: </label>
            <input type="number" id ="Age" value={Age} onChange={handleAge} min="0" required>
            </input>
          </div>

          {/* Number section */}
          <div className="Number-section">
            <label htmlFor="Number">Phone Number: </label>
            <input type="text" id="Number" value={phoneNumber} onChange={handlephoneNumber} onBlur={validatePhone}
            placeholder="(253)-555-6666" required></input>
          </div>

          { /* ID number */}
          <div className="Id-number-section">
            <label htmlFor="Id-number">ID number: </label>
            <input type="text" id="id-number" value={idNumber} onChange={handleidNumber} required></input>
          </div>

          {/* Emergency Contact section */}
          <div className="Emergency-header">
            <h2>Emergency Contact</h2>
          </div>

          <div className="Emergency-name">
            <label htmlFor="Emergency-name">Name: </label>
            <input type="text" id="Emergency-name" value={emergencyName} onChange={handleEmergencyName} required></input>
          </div>

          <div className="Relationship">
            <label htmlFor="Relationship">Relationship: </label>
            <input type="text" id="Relationship" value={relationship} onChange={handleRelationship} required></input>
          </div>

          <div className="emergency-number">
          <label htmlFor="emergency-number">Phone Number: </label>
          <input type="text" id="emergency-number" value={emergencyNumber} onChange={handleEmergencyNumber}onBlur={validateEmergencyNumber}placeholder="(253)-555-6666" required></input>
          </div>

          {/*Health Section */}
          <div className="Health-header">
            <h2>Health Information</h2>
          </div>

          <div className="health-question">
            <p>Do you have, or have you ever had, any of the following? Check all that apply: </p>
          </div>

          <div className="health-checkboxes">
            <label>
              <input type="checkbox" name="bloodborne" checked={Health.bloodborne} onChange={handleHealthCheck}></input>
                Blood-borne diseases (HIV, Hepatitis B/C)
            </label>

            <label>
              <input type="checkbox" name="diabetes" checked={Health.diabetes} onChange={handleHealthCheck}></input>
                Diabetes
            </label>

            <label>
              <input type="checkbox" name="skin" checked={Health.skin} onChange={handleHealthCheck}></input>
                Skin conditions (e.g, eczema, psoriasis)
            </label>

            <label>
              <input type="checkbox" name="latex" checked={Health.latex} onChange={handleHealthCheck}></input>
                Allergies to latex, pigments, or antiseptics
            </label>

            <label>
              <input type="checkbox" name="heart" checked={Health.heart} onChange={handleHealthCheck}></input>
                Heart conditions or pacemaker
            </label>

            <label>
              <input type="checkbox" name="bloodclott" checked={Health.bloodclott} onChange={handleHealthCheck}></input>
                Blood clotting issues or hemophilia
            </label>

            <label>
              <input type="checkbox" name="epilepsy" checked={Health.epilepsy} onChange={handleHealthCheck}></input>
                Epilepsy or seizures
            </label>

            <label>
              <input type="checkbox" name="pregnant" checked={Health.pregnant} onChange={handleHealthCheck}></input>
                Are you currently pregnant or breastfeeding?
            </label>

            <label>
            <input type="checkbox" name="none" checked={Health.none} onChange={handleHealthCheck}></input>
            N/A
            </label>
        </div>

            <div className="explain">
              <label htmlFor="explain">If yes to any of the above, please explain: </label>
              <textarea id="explain" value={Explain} onChange={handleExplain} rows={4} cols={50}></textarea>
          </div>

          <div className="influence">
            <label htmlFor="influence">Are you currently under the influence of drugs or alcohol? </label>
            <label htmlFor="influence-yes"><input 
              type="radio" 
              name="influence-yes" 
              value="Yes" 
              checked={Influence === "Yes"} 
              onChange={handleInfluence}></input>
              Yes 
            </label>

            <label className="influence-no" htmlFor="influence-no"><input 
              type="radio" 
              name="influence-no" 
              value="No" 
              checked={Influence === "No"} 
              onChange={handleInfluence}></input>
              No
            </label>

          </div>
          {/* Consent Section */}
          <div className="Consent-header">
            <h2>Consent and Release</h2>
          </div>

          <div className="Consent-paragraph">
            <p>By signing below, I acknowledge and agree to the following: </p>
          </div>

          <div className="Consent-questions">
          <ol>
            <li>
              <label htmlFor="first-consent">
                I am at least 18 years of age and have provided valid government-issued ID.
              </label>
            </li>

            <li>
              <label htmlFor="second-consent">
                I have truthfully disclosed all necessary medical and health information. 
              </label>
            </li>

            <li>
              <label htmlFor="third-consent">
                I understand the nature of the tattoo process and that it may involve discomfort, bleeding,or allergic reactions. 
              </label>
            </li>

            <li>
              <label htmlFor="fourth-consent">
                I understand there is a risk of infection and scarring and have been advised on proper aftercare.
              </label>
            </li>

            <li>
              <label htmlFor="fifth-consent">
                I release Cameron Pascual and the studio from all liability for any injury, loss, or damages that may result from the procedure. 
              </label>
            </li>

            <li>
              <label htmlFor="sixth-consent">
                I give my consent to be tattooed by Cameron Pascual at my own risk.
              </label>
            </li>

            <li>
              <label htmlFor="seventh-consent">
                I understand that the tattoo is permanent and removal may be costly or unsuccessful.
              </label>
            </li>

            <li>
              <label htmlFor="eigth-consent">
              I consent to photographs of my tattoo for artist portfolio or promotional use.
              </label>
            <label htmlFor="Eighteen_Yes">
              <input
                type="radio"
                id="Eighteen_Yes"
                name="firstQuestion"
                value="Yes"
                checked={Option === "Yes"}
                onChange={handleOption}
              />
              Yes
            </label>
            <label className="Eighteen_No" htmlFor="Eighteen_No">
              <input
                type="radio"
                id="Eighteen_No"
                name="firstQuestion"
                value="No"
                checked={Option === "No"}
                onChange={handleOption}
              />
              No
            </label>
            </li> 
          </ol>
          </div>

          {/*Client signature and photo ID */}
          <div className="Client-signature">
            <h3>Client Signature and Email </h3>
          </div>

          <div className="Signature">
            <SignatureCanvas penColor="black" canvasProps={{ width: 200, height: 100, className: 'sigCanvas' }}
            ref={signatureRef} placeholder="Signature">Client Signature: </SignatureCanvas>
          </div>

          <div className="client-Email">
          <input 
          type="email"
          id="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          ></input>
          </div>

          <div className="Date">
            <p>Date: {formattedDate} </p>
            <div className="Date-underline"></div>
          </div>

          <button className="clear" onClick={clearSignature}>Clear</button>
            <button className="save" onClick={saveSignature}>Save</button>
          {/* Submit Button */}
          <div className="Submit">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
