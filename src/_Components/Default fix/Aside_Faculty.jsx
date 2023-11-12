import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function Aside_Faculty({ clicked, setClicked }) {
  const [information, setInfo] = useState([]);
  const { TUPCID, setTUPCID } = useTUPCID();
  const asideRef = useRef(null);
  const path = usePathname();

  const fetchAside = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/FacultyAside?UidProf=${TUPCID}`
      );
      response.data.map((info) => {
        setInfo({
          FirstName: info.FIRSTNAME,
          MiddleName: info.MIDDLENAME,
          SurName: info.SURNAME,
          Tupcid: info.TUPCID,
          SubjectDept: info.SUBJECTDEPT,
        });
      });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const fetching = setInterval(() => {
      fetchAside();
    }, 1000);
    return () => {
      clearInterval(fetching);
    };
  }, [TUPCID]);

  const handleclick = () => {
    setClicked(!clicked);
  };

  const handleOutsideClick = (e) => {
    if (clicked && asideRef.current && !asideRef.current.contains(e.target)) {
      setClicked(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [clicked]);

  return (
    <>
      <aside className="min-vh-100 custom-red position-relative">
        <div className="h-100 d-sm-flex d-none flex-column justify-content-between align-items-center custom-red py-1 px-2 ">
          <div>
            <i
              className="bi bi-list fs-3 pe-auto custom-hover"
              onClick={handleclick}
            ></i>
          </div>
          <div className="d-flex flex-column">
            {path == "/Faculty/Settings" ? (
              <i className="bi bi-gear-fill fs-3"></i>
            ) : (
              <i className="bi bi-gear fs-3 custom-hover"></i>
            )}
            {path == "/Faculty/ReportProblem" ? (
              <i className="bi bi-exclamation-triangle-fill fs-3"></i>
            ) : (
              <i className="bi bi-exclamation-triangle fs-3 custom-hover"></i>
            )}

            <i className="bi bi-power fs-3 custom-hover"></i>
          </div>
        </div>
      </aside>
      <aside
        ref={asideRef}
        className={
          clicked
            ? "vh-100 position-fixed custom-aside-admin2 custom-red px-2"
            : "vh-100 position-fixed custom-aside-admin1 custom-red"
        }
      >
        <div className="h-100 d-flex flex-column justify-content-between align-items-center py-1 ">
          <div className="d-flex align-items-center">
            <img src="/TUPC.svg" alt="TUPC" height={70} width={70} className="custom-shadow-2" />
            <div className="d-flex flex-column custom-black-color ps-2">
              <small className="text-wrap">
                {information.FirstName} {information.MiddleName}
                {information.SurName}
              </small>
              <small>{information.Tupcid}</small>
              <small>{information.SubjectDept}</small>
            </div>
          </div>
          <div className="d-flex flex-column text-light align-self-start custom-black-color">
            <Link
              href={{ pathname: "/Faculty/Settings" }}
              className="text-decoration-none link-dark"
            >
              {path == "/Faculty/Settings" ? (
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-gear-fill fs-3"></i>
                  <span className="fs-5 fw-bold">SETTINGS</span>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-1 custom-hover">
                  <i className="bi bi-gear fs-3"></i>
                  <span className="fs-5">SETTINGS</span>
                </div>
              )}
            </Link>
            <Link
              href={{ pathname: "/Faculty/ReportProblem" }}
              className="text-decoration-none link-dark"
            >
              {path == "/Faculty/ReportProblem" ? (
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                  <span className="fs-5 fw-bold">REPORT PROBLEM</span>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-1 custom-hover">
                  <i className="bi bi-exclamation-triangle fs-3"></i>

                  <span className="fs-5">REPORT PROBLEM</span>
                </div>
              )}
            </Link>
            <Link
              href={{ pathname: "/Login" }}
              className="text-decoration-none link-dark"
              onClick={() => setTUPCID("")}
            >
              <div className="d-flex align-items-center gap-1 custom-hover">
                <i className="bi bi-power fs-3"></i>
                <span className="fs-5">LOGOUT</span>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
export default Aside_Faculty;
