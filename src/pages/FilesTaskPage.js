import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Card, Button } from "react-bootstrap";
import { SpinnerCircular } from "spinners-react";
import { useParams } from "react-router-dom";
import { FaTrashAlt, FaUpload } from "react-icons/fa";

import Nav from "../components/Nav";
import { updateImage } from "../functions/generalFuntions";

const FilesTaskPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  console.log("ID TASK: ", id);
 
  useEffect(() => {
    getData()
  }, []);

  const getData = async () => {
     const dataTask = await fetch(
       "http://localhost:5000/carbografitos/us-central1/api/files/"+id
     )
       .then((response) => response.json())
       .then((data) => data);
       setData(dataTask);
       setLoading(false)
      console.log(dataTask)
  };

  const uploadFile = async (file) => {
    const imgUrl = await updateImage(file);
    insertImageTask(imgUrl, id);
  };

  const insertImageTask = async (imgUrl, elementSelected) => {
    await fetch("http://localhost:5000/carbografitos/us-central1/api/files", {
      method: "POST",
      body: JSON.stringify({
        IdResponsible: data.length > 0 ? data[0].task.IdResponsible : null,
        idtask: id,
        name: id,
        url: imgUrl,
        state: "Active",
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
    getData();
  };

  const deleteImageTask = async(idfile_task) =>{
    console.log(idfile_task);
    await fetch("http://localhost:5000/carbografitos/us-central1/api/files", {
      method: "PATCH",
      body: JSON.stringify({
        state: "Inactive",
        idfile_task:idfile_task
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
    getData();
  };

  return (
    <Fragment>
      <Nav />
      {loading ? (
        <SpinnerCircular />
      ) : (
        <Container>
          <Button
            className="mt-3"
            style={{ backgroundColor: "#1565C0" }}
            onClick={() => document.getElementById("uploadFile").click()}
          >
            <FaUpload />
          </Button>
          {/* UPLOAD FILE */}
          <input
            onChange={(e) => uploadFile(e.target.files[0])}
            id="uploadFile"
            type="file"
            hidden
          />
          <Row className="mt-5">
            {data.map((element, index) => {
              if (
                element.url.match(".jpg") ||
                element.url.match(".jpeg") ||
                element.url.match(".png")
              ) {
                return (
                  <div className="col col-lg-5" key={index}>
                    <Card>
                      <img src={element.url} />
                      <Button variant="danger" onClick={()=>{deleteImageTask(element.idfile_task)}}>
                        <FaTrashAlt />
                      </Button>
                    </Card>
                  </div>
                );
              } else {
                if(index >0){
                  return (
                    <div className="col col-lg-5" key={index}>
                      <Card>
                        <iframe src={element.url} style={{ height: 400 }} />
                        <Button variant="danger">
                          <FaTrashAlt />
                        </Button>
                      </Card>
                    </div>
                    
                  );
                }
              }
            })}
          </Row>
        </Container>
      )}
    </Fragment>
  );
};

export default FilesTaskPage;
