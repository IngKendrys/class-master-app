import { useState, useEffect } from "react";
import "./Styles.css";

export function Checkboxs({ attendance, student, onUpdateAttendance, date, currentDate, schedule }) {
  const [newAttendance, setAttendance] = useState("");
  useEffect(() => {
    if (attendance === "" || attendance) {
      setAttendance(attendance || "");
    }
  }, [attendance,date]);

  const handleAttendanceChange = (value, student) => {
    setAttendance(value);
    onUpdateAttendance(value, student);
  };

  let isChecked = false;
  let isDisabled = false;

  if (date !== currentDate && date !== "") {
    isChecked = newAttendance !== "";
    isDisabled = false;
  } else if (date == currentDate) {
    isChecked = newAttendance !== "";
    isDisabled = !schedule;
  } else if (date === "") {
    isDisabled = true;  
  }

  let asistencia = true;
  let falla = true;
  let excusa = true;

  if (date !== currentDate){
    if (newAttendance === "asistencia"){
      asistencia = false;
    } else if (newAttendance === "falla") {
      falla = false;
    } else if (newAttendance === "excusa"){
      excusa = false;
    }
  }
  if (date === currentDate || date !== ""){
    return (
      <td align="center">
        <input
          type="radio"
          className="radiobtn attendance"
          name={`attendance-${student.identification}`}
          value="asistencia"
          checked={newAttendance === "asistencia" && isChecked && schedule}
          disabled={date === currentDate?isDisabled:asistencia}
          onChange={() => handleAttendanceChange("asistencia", student)}
        />
        <input
          type="radio"
          className="radiobtn lack"
          name={`attendance-${student.identification}`}
          value="falla"
          checked={newAttendance === "falla" && isChecked}
          disabled={date === currentDate ? isDisabled : falla}
          onChange={() => handleAttendanceChange("falla", student)}
        />
        <input
          type="radio"
          className="radiobtn excuse"
          name={`attendance-${student.identification}`}
          value="excusa"
          checked={newAttendance === "excusa" && isChecked}
          disabled={date === currentDate ? isDisabled : excusa}
          onChange={() => handleAttendanceChange("excusa", student)}
        />
      </td>
    )
  }
  return (
    <td align="center">
      <input
        type="radio"
        className="radiobtn attendance"
        disabled={isDisabled}
      />
      <input
        type="radio"
        className="radiobtn attendance"
        disabled={isDisabled}
      />
      <input
        type="radio"
        className="radiobtn attendance"
        disabled={isDisabled}
      />
    </td>
  );
}
