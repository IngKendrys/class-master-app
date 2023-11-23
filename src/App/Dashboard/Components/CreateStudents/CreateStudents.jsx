import React, { useEffect, useState } from "react";
import "./Styles/Styles.css";
import axios from "axios";
import profile from "../../../../Images/Default_pfp.svg.png";
import { saveAs } from 'file-saver';

function CreateStudents({ user, selected }) {
  const [subjects, setSubjects] = useState([]);
  const [groupNames, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    avatar: profile,
    photo: profile,
    typeId: "",
    identification: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    subject: [{ name: "", group: "" }],
    address: "",
    email: "",
  });

  //ACTUALIZA EL ESTADO DEL FORMDATA CUANDO UN INPUT CAMBIA
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "photo") {
      const file = event.target.files[0];
      const reader = new FileReader();
      try {
        reader.onload = () => {
          setFormData({ ...formData, avatar: reader.result, photo: file });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.log("Error");
      }
    } else if (name === "subject") {
      const newAsignatura = [...formData.subject];
      newAsignatura[0] = { ...newAsignatura[0], name: value };
      setFormData((prevState) => ({ ...prevState, subject: newAsignatura }));
    } else if (name === "group") {
      const newGroup = [...formData.subject];
      newGroup[0] = { ...newGroup[0], group: value };
      setFormData((prevState) => ({ ...prevState, subject: newGroup }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  //SIEMPRE QUE SE RENDERIZA EL COMPONENTE HACE UN GET DE LAS ASIGNATURAS DEL PROFESOR
  useEffect(() => {
    const handleSubjects = () => {
      axios
        .get(
          `https://api-classmaster.onrender.com/api/subjects/${user.email}`,
          { headers: { Authorization: `Bearer ${user.tokenSession}` } }
        )
        .then((response) => setSubjects(response.data));
    };
    handleSubjects();
  }, [selected]);

  //TRAE LOS GRUPOS SIEMPRE QUE UNA MATERIA ES SELECCIONADA
  useEffect(() => {
    const handleGroups = () => {
      const groupSubject = subjects.find(
        (subject) => subject.name === formData.subject[0].name
      );
      if (groupSubject && groupSubject.groups) {
        setGroups(groupSubject.groups.map((group) => group.name));
      }
    };
    handleGroups();
  }, [formData.subject]);

  //HACE EL POST A LA API DEPENDIENDO DEL CLICK DEL BOTON
  const NewStudent = (e) => {
    e.preventDefault();

    const Data = new FormData();
    formData.photo && Data.append("avatar", formData.photo);
    formData.typeId != "" && Data.append("typeId", formData.typeId);
    formData.identification != "" && Data.append("identification", formData.identification);
    formData.name != "" && Data.append("name", formData.name);
    formData.lastName != "" && Data.append("lastName", formData.lastName);
    formData.email != "" && Data.append("email", formData.email);
    formData.phoneNumber != "" && Data.append("phoneNumber", formData.phoneNumber);
    formData.address != "" && Data.append("address", formData.address);

    if (formData.subject[0].name !== "" && formData.subject[0].group !== "") {
      const subject = {
        subject: formData.subject[0].name,
        group: formData.subject[0].group,
      };
      const subjectsArray = [subject]; 
      const subjectsJSON = JSON.stringify(subjectsArray); 
      Data.append("asignatura", subjectsJSON);
    }
      axios
        .post(
          `https://api-classmaster.onrender.com/api/students/${user.email}`,
          Data,
          {
            headers: {
              Authorization: `Bearer ${user.tokenSession}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(() => {
          alert("Estudiante creado satisfactoriamente.");
        })
        .catch(() => {
          alert("No se pudo crear el estudiante, revisa los datos nuevamente.");
        });
  };

  //ABRE EL INPUT PARA SUBIR EL EXCEL
  const handleExcel = () => {
    const fileInput = document.getElementById("file-input");
    fileInput.click(); 
  };

  //HACE EL POST DE LOS ESTUDIANTES ATRAVES DE UN EXCEL
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("template", file); 
    axios
      .post(`https://api-classmaster.onrender.com/api/students/excel/${user.email}`, forData, {
        headers: {
          Authorization: `Bearer ${user.tokenSession}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() =>
        alert("Estudiantes creados satisfactoriamente a través del excel.")
      )
      .catch(() =>
        alert(
          "No se pudo crear los estudiante, revisa los datos en el excel nuevamente."
        )
      );
  };

  //TRAE DE LA API UNA PLANTILLA DE EXCEL QUE ES GUIA PARA HACER EL POST CON EXCEL
  const handlePlantilla = () => {
    axios
      .get(
        "https://api-classmaster.onrender.com/api/template/template.xlsx",
        {
          headers: {
            Authorization: `Bearer ${user.tokenSession}`,
            Accept: "application/vnd.ms-excel",
          },
          responseType: "blob",
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        });
        saveAs(blob, "Plantilla de estudiantes.xlsx");
      });
  };

  return (
    <div className='CreateStudents'>
      <form className='CreateStudents-form' onSubmit={NewStudent}>
        <img src={formData.avatar} alt='photo' className='CreateStudents_photo' />
        <input
          className=' input-photo'
          name='photo'
          type='file'
          onChange={handleInputChange}
        />
        <div className='CS_flex'>
          <div className='CS_flex-element'>
            <label>
              <strong>Tipo de documento</strong>
            </label>
            <br />
            <select
              className='select'
              value={formData.typeId}
              name='typeId'
              onChange={handleInputChange}
              required>
              <option></option>
              <option>Tarjeta de Identidad</option>
              <option>Cedula de Ciudadanía</option>
              <option>Cedula de Extranjería</option>
            </select>
            <br />
          </div>
          <div className='CS_flex-element'>
            <label>
              <strong>N° de identificación</strong>{" "}
            </label>
            <br />
            <input
              className='input'
              type="number"
              name='identification'
              value={formData.identification}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            <br />
          </div>
        </div>
        <div className='CS_flex'>
          <div className='CS_flex-element'>
            <label>
              <strong>Nombres</strong>
            </label>
            <input
              type='text'
              className='input text'
              value={formData.name}
              name='name'
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
          </div>
          <div className='CS_flex-element'>
            <label>
              <strong>Apellidos </strong>
            </label>
            <input
              type='text'
              className='input text'
              value={formData.lastName}
              name='lastName'
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <label>
          <strong>Teléfono</strong>
        </label>
        <input
          className='input text'
          type="number"
          value={formData.phoneNumber}
          name='phoneNumber'
          autoComplete="off"
          onChange={handleInputChange}
        />
        <label>
          <strong>Email</strong>
        </label>
        <input
          className='input text'
          type='email'
          value={formData.email}
          name='email'
          autoComplete="off"
          onChange={handleInputChange}
        />
        <div className='CS_flex'>
          <div className='CS_flex-element'>
            <label>
              <strong>Asignatura</strong>
            </label>
            <select
              className='select text'
              value={formData.subject[0].name}
              name='subject'
              onChange={handleInputChange}>
              <option></option>
              {subjects.map((subject) => {
              return (
                  <option key={subject.code}>{subject.name}</option>);
              })}              
            </select>
          </div>
          <div className='CS_flex-element'>
            <label>
              <strong>Grupo</strong>
            </label>
            <select
              className='select text'
              value={formData.subject[0].group}
              name='group'
              onChange={handleInputChange}>
              <option></option>
              {groupNames.map((group) => (
                <option key={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>
        <label>
          <strong>Dirección</strong>
        </label>
        <input
          className='input text'
          value={formData.address}
          autoComplete="off"
          name='address'
          onChange={handleInputChange}
        />
        <div className='CS_btns'>
          {" "}
          <button className='btn' type='button' onClick={handlePlantilla}>
            Plantilla de excel
          </button>
          <button className='btn' type='button' onClick={handleExcel}>
            Cargar excel
          </button>
          <button className='btn' type='submit' style={{margin: "0"}}>
            Guardar
          </button>
          <input
            id='file-input'
            type='file'
            onChange={handleFileInputChange}
            accept='.xlsx, .xls'
            style={{ display: "none" }}
          />
        </div>
      </form>
    </div>
  );
}

export default CreateStudents;