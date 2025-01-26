import {
  faCamera,
  faCircleDot,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Form, NavLink } from "react-bootstrap";
import "./settings.scss";
import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../../../../context/DarkModeContext";
export default function Settings() {
  const { setIsDarkMode } = useDarkMode();
  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem("selectedColor") || "#C381E7"; // Default color if none saved
  });

  const colors = [
    "#a76c60",
    "#53865c",
    "#676f95",
    "#fff",
    "#C381E7",
    "#78a4a1",
  ];

  useEffect(() => {
    const savedColor = localStorage.getItem("selectedColor");
    if (savedColor) {
      setSelectedColor(savedColor); // Set saved color if it exists
    }
  }, []);

  // Save the color to local storage whenever it changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      selectedColor
    );
    localStorage.setItem("selectedColor", selectedColor);
  }, [selectedColor]);
  // Function to handle color selection
  const handleColorChange = (color) => {
    setSelectedColor(color); // Update the selected color in state
    setIsDarkMode(false);
  };

  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };
  return (
    <div className="settings">
      <div className="settings-header d-flex justify-content-between align-items-start p-3 position-relative">
        <h3>Settings</h3>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <span
          onClick={handleButtonClick}
          style={{ cursor: "pointer", padding: "5px" }}
        >
          <FontAwesomeIcon icon={faPencil} />
        </span>
      </div>
      <div className="profile-info position-absolute w-100">
        <div className="mb-3 img-preview text-center">
          <label htmlFor="formFile" className="form-label position-relative">
            <img
              src={require(`../../../../assets/profile/profile-img.png`)}
              alt="Preview"
              className="img-thumbnail"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <div className="position-absolute icon">
              <FontAwesomeIcon icon={faCamera} />
            </div>
          </label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            accept="image/*"
            /* onChange={handleImageChange} */
          />
          <h3>Fatma Ahmad</h3>
          <FontAwesomeIcon icon={faCircleDot} color="green" />
          <Form.Select>
            <option> Active</option>
            <option value="1">Away</option>
            <option value="2">Don't disturb</option>
          </Form.Select>
        </div>

        <hr />
      </div>
      <div
        className="settings-details custom-scrollbar p-3"
        style={{ marginTop: "180px" }}
      >
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Personal Info</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <span>Name</span>
                  <p>Fatma Ahmad</p>
                </div>
                <span>
                  <FontAwesomeIcon icon={faPencil} />
                </span>
              </div>
              <div>
                <span>Email</span>
                <p>admin@gmail.com</p>
              </div>
              <div>
                <span>Location</span>
                <p>Mansourah,Egypt</p>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Themes</Accordion.Header>
            <Accordion.Body>
              <p>Choose theme color :</p>
              <div
                className="palette-colors d-flex justify-content-center align-items-center gap-2 flex-wrap"
                style={{ zIndex: 5555 }}
              >
                {colors.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: color,
                      borderRadius: "50%",
                      cursor: "pointer",
                      border:
                        selectedColor === color ? "3px solid black" : "none",
                    }}
                    onClick={() => handleColorChange(color)} // Set color on click
                  />
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Privacy</Accordion.Header>
            <Accordion.Body>
              <div className="privacy-details">
                <div className="d-flex justify-content-between align-items-center">
                  <h6>Profile photo</h6>
                  <Form.Select>
                    <option>Everybody</option>
                    <option value="2">Selected</option>
                    <option value="3">none</option>
                  </Form.Select>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <h6>Last seen</h6>
                  <Form.Check type="switch" id="custom-switch3" />
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <h6>Status</h6>
                  <Form.Select>
                    <option>Everybody</option>
                    <option value="2">Selected</option>
                    <option value="3">none</option>
                  </Form.Select>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <h6>Read receipts</h6>
                  <Form.Check type="switch" id="custom-switch2" />
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Security</Accordion.Header>
            <Accordion.Body>
              <div className="security-details">
                <div className="d-flex justify-content-between align-items-center">
                  <h6>Show security notification</h6>
                  <Form.Check type="switch" id="custom-switch1" />
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>Help</Accordion.Header>
            <Accordion.Body>
              <div className="help-details">
                <NavLink>FAQs</NavLink>
                <hr />
                <NavLink>Contact</NavLink>
                <hr />
                <NavLink>Terms & Privacy policy</NavLink>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}
