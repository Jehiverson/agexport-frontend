import React, { Fragment, useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Form, Modal } from "react-bootstrap";
import { FaEdit, FaUpload, FaFolderOpen, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";

import "react-datepicker/dist/react-datepicker.css";

import Swal from 'sweetalert2'
import DataTable from "react-data-table-component";
import moment from 'moment';
import DatePicker from "react-datepicker";

import { updateImage } from "../functions/generalFuntions";

import Nav from "../components/Nav";

const HomePage = () => {
  const navigate = useNavigate();
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalPreview, setIsModalPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState([]);
  const [dataResponsible, setDataResponsible] = useState([]);
  const [idTask, setIdTask] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [responsible, setResposible] = useState(null);
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  //const [file, setFile] = useState(null);
  const [elementSelected, setElementSelected] = useState(null);
  const columns = [
    {
      name: "ID",
      selector: (row) => row.idtask,
    },
    {
      name: "Titulo",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Fecha inicio",
      selector: (row) => row.date_at,
      sortable: true,
    },
    {
      name: "Fecha finalización",
      selector: (row) => row.date_end,
      sortable: true,
    },
    {
      name: "Responsable",
      selector: (row) => row.responsible.name,
      sortable: true,
    },
    {
      name: "Prioridad",
      selector: (row) => row.priority,
      sortable: true,
    },
    {
      name: "Opciones",
      selector: (row) => row.action,
    },
  ];

  const getData = async () => {
    let newArrayData = [];
    const dataTask = await fetch(
      "http://localhost:5000/carbografitos/us-central1/api/task"
    )
      .then((response) => response.json())
      .then((data) => data);

    dataTask.map((item) => {
      let element = (
        <ButtonGroup aria-label="Basic example">
          <Button
            onClick={() => updateAsignate(item)}
            variant="warning"
          >
            <FaEdit />
          </Button>
          <Button
            onClick={() =>
              item.file_tasks.length > 0
                ? navigate(`/files/${item.idtask}`)
                : onClickUploadFile(item.idtask)
            }
            variant="success"
          >
            {item.file_tasks.length > 0 ? <FaFolderOpen /> : <FaUpload />}
          </Button>
          <Button variant="danger" onClick={() => deleteTask(item)}>
            <FaTrashAlt />
          </Button>
        </ButtonGroup>
      );

      return newArrayData.push({ ...item, action: element });
    });

    const dataResponsibles = await fetch(
      "http://localhost:5000/carbografitos/us-central1/api/responsible"
    )
      .then((response) => response.json())
      .then((data) => data);

    setNewData(newArrayData);
    setDataResponsible(dataResponsibles);
    setLoading(true);

    
  };

  const updateAsignate = (data) => {
    
    setTitle(data.title);
    setDescription(data.description);
    setDateStart(new Date(data.date_at));
    setDateEnd(new Date(data.date_end));
    setResposible(data.IdResponsible);
    setStatus(data.status);
    setPriority(data.priority);
    setIdTask(data.idtask);
    setIsModalUpdate(!isModalUpdate);
  };

  const clearData = () =>{
    setTitle(null);
    setDescription(null);
    setDateStart(null);
    setDateEnd(null);
    setResposible(null);
    setStatus(null);
    setPriority(null);
    setIdTask(null);
  };

  const insertTask = async() => {
    if(!title && !description && !dateStart && !dateEnd && !responsible && !status && !priority){
      Swal.fire(
        'Campos incompletos',
        '',
        'error'
      );
      return;
    }

    let timerInterval
    Swal.fire({
      title: 'Creando Task',
      timer: 6000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    })

    await fetch("http://localhost:5000/carbografitos/us-central1/api/task", {
      method: "POST",
      body: JSON.stringify({
        IdResponsible: responsible,
        title: title,
        description: description,
        status: status,
        priority: priority,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
      Swal.fire(
        'Registro Creado',
        '',
        'success'
      );

      getData();
      clearData();
      setIsModalCreate(!isModalCreate);
  };

  const onClickUploadFile = (id) => {
    setElementSelected(id);
    document.getElementById("uploadFile").click();
  };

  const uploadFile = async (file) => {
    let timerInterval
    Swal.fire({
      title: 'Sudiendo archivo',
      timer: 6000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    });

    console.group("PARAMETROS DE FUNCIOON uploadFile");
    console.log("ID TASK", elementSelected);
    console.log("FILE DATA", file);
    console.groupEnd();
    const imgUrl = await updateImage(file);
    insertImageTask(imgUrl, elementSelected);
    Swal.fire(
      'Archivo Subido',
      '',
      'success'
    );
  };

  const deleteTask = async (data) => {
    let timerInterval
    Swal.fire({
      title: 'Desactivando Task',
      timer: 6000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    });
    await fetch("http://localhost:5000/carbografitos/us-central1/api/task", {
      method: "PATCH",
      body: JSON.stringify({
        idtask: data.idtask,
        IdResponsible: data.responsible.idresponsible,
        title: data.title,
        description: data.description,
        status: "Inactive",
        priority: data.priority,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);

      Swal.fire(
        'Registro Inactivado',
        '',
        'success'
      );
    getData();
    clearData();
  };

  const insertImageTask = async (imgUrl, elementSelected) => {
    await fetch("http://localhost:5000/carbografitos/us-central1/api/files", {
      method: "POST",
      body: JSON.stringify({
        IdResponsible: responsible,
        idtask: elementSelected,
        name: elementSelected,
        url: imgUrl,
        state: "Active",
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
    getData();
  };

   const updateTask = async() => {
    if(!title && !description && !dateStart && !dateEnd && !responsible && !status && !priority){
      Swal.fire(
        'Campos incompletos',
        '',
        'error'
      );
      return;
    }

    let timerInterval
    Swal.fire({
      title: 'Actualizando Task',
      timer: 6000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    });

    await fetch('http://localhost:5000/carbografitos/us-central1/api/task', {
      method: 'PATCH',
      body: JSON.stringify({
      "idtask":idTask,
      "IdResponsible": responsible,
      "title":title,
      "description":description,
      "status":status,
      "priority":priority})
    })
    .then(response => response.json())
    .then(data => data);
    Swal.fire(
        'Registro Actualizado',
        '',
        'success'
      );

    getData();
    clearData();
    setIsModalUpdate(false);
  };

  const toastRemember = async() =>{
    let datosRemember = await fetch('http://localhost:5000/carbografitos/us-central1/api/task-nextEnd')
    .then(response => response.json())
    .then(data => data);

    if(localStorage.getItem("isValid") !== "true" && datosRemember.length > 0 ){
      let datosShow = "<h4>Pendientes</h1><ul style='list-style:none', text-align: right>";

      datosRemember.map((task)=>{
          datosShow += `<li>${task.title}- ${task.date_end}</li>`
      });
  
      datosShow+="</ul>";
      console.log(datosShow);
      Swal.fire({
        title: 'Tienes Task Por Vencer',
        html:datosShow,
        showDenyButton: true,
        confirmButtonText: 'Okay',
        denyButtonText: `Recordarme despues`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          localStorage.setItem("isValid", "true");
        }
      });
    }
    
  };

  useEffect(() => {
    getData();
    toastRemember()
  }, []);
 
  return (
    <Fragment>
      <Nav />
      <br />
      <div style={{ marginLeft: "10%", marginRight: "10%" }}>
        <Button
          style={{ backgroundColor: "#1565C0", fontWeight: 600 }}
          onClick={() => setIsModalCreate(!isModalCreate)}
        >
          Agregar
        </Button>
        <br />
        <br />
        {loading ? (
          <DataTable columns={columns} data={newData} />
        ) : (
          <SpinnerCircular />
        )}
      </div>
      {/* UPLOAD FILE */}
      <input
        onChange={(e) => uploadFile(e.target.files[0])}
        id="uploadFile"
        type="file"
        hidden
      />

      {/* MODAL AGREGAR */}
      <Modal
        show={isModalCreate}
        size="lg"
        onHide={() => setIsModalCreate(!isModalCreate)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label htmlFor="titulo">Titulo</Form.Label>
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              id="titulo"
            />
            <Form.Label htmlFor="descripcion">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              style={{ height: "150px" }}
              id="descripcion"
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <div className="row mt-2">
              <div className="col">
                <Form.Label htmlFor="dateStart">Fecha de inicio</Form.Label>
                <Form.Control
                  onChange={(e) => setDateStart(e.target.value)}
                  type="date"
                  id="dateStart"
                />
              </div>
              <div className="col">
                <Form.Label htmlFor="dateEnd">Fecha de finalización</Form.Label>
                <Form.Control
                  onChange={(e) => setDateEnd(e.target.value)}
                  type="date"
                  id="dateEnd"
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
                <Form.Label htmlFor="responsable">Responsable</Form.Label>
                <Form.Select
                  onChange={(e) => setResposible(e.target.value)}
                  id="responsable"
                >
                  <option>Selecciona un opción</option>
                  {
                    dataResponsible.map((responsible)=>{
                      return (
                        <option value={responsible.idresponsible} key={responsible.idresponsible}>{responsible.name}</option>
                        )
                    })
                  }
                </Form.Select>
              </div>
              <div className="col">
                <Form.Label htmlFor="estado">Estado</Form.Label>
                <Form.Select
                  onChange={(e) => setStatus(e.target.value)}
                  id="estado"
                >
                  <option>Selecciona un opción</option>
                  <option value="Active">Activo</option>
                  <option value="Inactive">Inactivo</option>
                </Form.Select>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
                <Form.Label htmlFor="estado">Prioridad</Form.Label>
                <Form.Select
                  onChange={(e) => setPriority(e.target.value)}
                  id="estado"
                >
                  <option>Selecciona un opción</option>
                  <option value="High">Alta</option>
                  <option value="Medium">Media</option>
                  <option value="Low">Baja</option>
                </Form.Select>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsModalCreate(!isModalCreate)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => insertTask()}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* MODAL EDITAR */}
      <Modal
        show={isModalUpdate}
        size="lg"
        onHide={() => setIsModalUpdate(!isModalUpdate)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label htmlFor="titulo" >Titulo</Form.Label>
            <Form.Control type="text" id="titulo" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <Form.Label htmlFor="descripcion">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              style={{ height: "150px" }}
              id="descripcion"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="row mt-2">
              {console.log(moment(dateStart).format("DD/MM/YYYY"))}
              <div className="col">
                <Form.Label htmlFor="dateStart">Fecha de inicio</Form.Label>
                {/* <Form.Control type="date" id="dateStart" defaultValue={moment(dateStart).format("DD/MM/YYYY")} onChange={(e) => setDateStart(e.target.value)}/> */}
                <DatePicker
                    selected={dateStart}
                    onChange={(value) => {
                      setDateStart(value);
                      }}
                    className="form-control"
                  />
              </div>
              <div className="col">
                <Form.Label htmlFor="dateEnd">Fecha de finalización</Form.Label>
                {/* <Form.Control type="date" id="dateEnd" defaultValue={new Date(dateEnd)} onChange={(e) => setDateEnd(e.target.value)}/> */}
                <DatePicker
                    selected={dateEnd}
                    onChange={(value) => {
                      setDateStart(value);
                      }}
                    className="form-control"
                  />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
                <Form.Label htmlFor="responsable">Responsable</Form.Label>
                <Form.Select
                  onChange={(e) => setResposible(e.target.value)}
                  id="responsable"
                  value={responsible}
                >
                  <option>Selecciona un opción</option>
                  {
                    dataResponsible.map((responsible)=>{
                      return (
                        <option value={responsible.idresponsible} key={responsible.idresponsible}>{responsible.name}</option>
                        )
                    })
                  }
                </Form.Select>
              </div>
              <div className="col">
              {console.log(status)}
                <Form.Label htmlFor="estado">Estado</Form.Label>
                <Form.Select id="estado" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option>Selecciona un opción</option>
                  <option value="Active">Activo</option>
                  <option value="Inactive">Inactivo</option>
                </Form.Select>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
              {console.log(priority)}
                <Form.Label htmlFor="estado">Prioridad</Form.Label>
                <Form.Select id="estado" value={priority} onChange={(e) => {
                  console.log(e.target.value);
                  setPriority(e.target.value)
                  }}>
                  <option>Selecciona un opción</option>
                  <option value="High">Alta</option>
                  <option value="Medium">Media</option>
                  <option value="Low">Baja</option>
                </Form.Select>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>*
          <Button
            variant="secondary"
            onClick={() => setIsModalUpdate(!isModalUpdate)}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => updateTask()}
          >
            Editar
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default HomePage;
