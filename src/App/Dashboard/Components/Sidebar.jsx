import { useState } from "react";
import Logo from "../../../Images/Logo.png";
import {BsCalendarWeek, BsFillJournalBookmarkFill, BsArrowRightShort, BsArrowDownShort} from "react-icons/bs";
import { VscMortarBoard } from "react-icons/vsc";

import "../Styles/Styles.css";

function Sidebar({ updateState }) {
  const [selectedOption, setSelectedOption] = useState("Horario");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [option, setOption] = useState("");

  const handleAct = (text) => {
    if (text === selectedOption && isMenuOpen) {
      setIsMenuOpen(false);
    } else {
      setSelectedOption(text);
      setIsMenuOpen(true);
    }
  };

  const toggleStateDash = (Option) => {
    updateState(Option);
    setOption(Option);
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <img src={Logo} alt="Logo_sidebar" width={35} height={30} />
        <h3 className="nameApp">ClassMaster</h3>
      </div>
      <div className="sidebar__content">
        <ul className="sidebar__items">
          <li className={`sidebar__item ${selectedOption === "Horario" ? "selected-list" : ""}`} onClick={() => {toggleStateDash("Horario"), handleAct("Horario");}}>
            <BsCalendarWeek className="svg" size={18} />
            <span className="span">Horario</span>
          </li>
          <div className={`sidebar__item ${selectedOption === "Students" ? "selected-list" : ""}`}>
            <li onClick={() => {handleAct("Students");}}>
              <VscMortarBoard className="svg" size={22} />
              <span className="span">Estudiantes</span>

              {selectedOption === "Students" && isMenuOpen ? (<BsArrowDownShort className="svg arrow" />) : 
              (<BsArrowRightShort className="svg arrow" />)}

            </li>
            <div className={`menu ${selectedOption === "Students" && isMenuOpen ? "open" : ""}`}>
              <ul>
                <li className={"dropdown__items sidebar__link" + " " + (option === "Ingresar Estudiantes" ? "links" : "")}
                  onClick={() => {toggleStateDash("Ingresar Estudiantes");}}>
                  Ingresar Estudiantes
                </li>
                <li className={"dropdown__items sidebar__link" + " " + (option === "Lista de Estudiantes" ? "links" : "")}
                  onClick={() => {toggleStateDash("Lista de Estudiantes");}}>
                  Lista de Estudiantes
                </li>
                <li className={"dropdown__items sidebar__link" + " " + (option === "Asistencia" ? "links" : "")}
                  onClick={() => {toggleStateDash("Asistencia");}}>
                  Asistencia
                </li>
                <li className={"dropdown__items sidebar__link" + " " + (option === "Notas" ? "links" : "")}
                  onClick={() => {toggleStateDash("Notas");}}>
                  Notas
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`sidebar__item ${
              selectedOption === "Asignaturas" ? "seleccionado" : ""
            }`} 
          >
            <li
              className="createasignatura"
              onClick={() => {
                handleAct("Asignaturas");
                toggleStateDash("Asignaturas");
              }}
            >
              <BsFillJournalBookmarkFill className="svg" size={18} />
              <span
                className="span"
              >
                Asignaturas
              </span>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
