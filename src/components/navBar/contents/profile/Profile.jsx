import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./profile.scss";
import {
  faCircleDot,
  faCircleInfo,
  faCircleQuestion,
  faDownload,
  faEllipsis,
  faEllipsisVertical,
  faFile,
  faGear,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { Accordion, Dropdown } from "react-bootstrap";
import { useUserStore } from "../../../../lib/userStore";
export default function Profile() {
  const {currentUser} = useUserStore()

  return (
    <div className="profile">
      <div className="profile-header d-flex justify-content-between p-3">
        <h3>My Profile</h3>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              href="#/action-1"
              className="d-flex justify-content-between align-items-center"
            >
              Info <FontAwesomeIcon icon={faCircleInfo} />
            </Dropdown.Item>
            <Dropdown.Item
              href="#/action-2"
              className="d-flex justify-content-between align-items-center"
            >
              Settings <FontAwesomeIcon icon={faGear} />
            </Dropdown.Item>
            <Dropdown.Item
              href="#/action-3"
              className="d-flex justify-content-between align-items-center"
            >
              Help <FontAwesomeIcon icon={faCircleQuestion} />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="profile-info text-center">
        <img
          src={require(`../../../../assets/profile/profile-img.png`)}
          width={"70px"}
          height={"70px"}
          alt="profile-img"
        />
        <h3>{currentUser.username}</h3>
        <p className="mb-4">
          <FontAwesomeIcon icon={faCircleDot} color="green" /> Active
        </p>
        <hr />
      </div>
      <div className="profile-details custom-scrollbar p-3" style={{ marginTop: "150px" }}>
        <p className="text-break">Lorem ipsum dolor sit amet consectetu</p>
        <p> aut exercitationem, minus tenetu</p>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>About</Accordion.Header>
            <Accordion.Body>
              <div>
                <span>Name</span>
                <p>{currentUser.username}</p>
              </div>
              <div>
                <span>Email</span>
                <p>{currentUser.email}</p>
              </div>
              <div>
                <span>Location</span>
                <p>Mansourah,Egypt</p>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Attached Files</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex align-items-center justify-content-between border p-2 mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="py-2 px-3 background-icon">
                    <FontAwesomeIcon size="lg" icon={faFile} />
                  </div>
                  <div>
                    <p className="mb-0">File.pdf</p>
                    <span>12.5 MB</span>
                  </div>
                </div>
                <div className="d-flex flex-row-reserve gap-3">
                  <FontAwesomeIcon icon={faDownload} />
                  <FontAwesomeIcon icon={faEllipsis} />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between border p-2">
                <div className="d-flex align-items-center gap-3">
                  <div className="py-2 px-3 background-icon">
                    <FontAwesomeIcon size="lg" icon={faImage} />
                  </div>
                  <div>
                    <p className="mb-0">img-1.JPG</p>
                    <span>12.5 MB</span>
                  </div>
                </div>
                <div className="d-flex flex-row-reserve gap-3">
                  <FontAwesomeIcon icon={faDownload} />
                  <FontAwesomeIcon icon={faEllipsis} />
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}
