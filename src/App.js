import "./App.css";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "react-modal";
Modal.setAppElement("#root");
function App() {
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
  });
  const [editId, setEditId] = useState("");
  const fetchData = () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  };
  useEffect(() => {
    fetchData();
  }, [modal]);
  const initialValues = {
    teamMember: "",
    task: "",
    priority: "low",
  };

  const validationSchema = Yup.object().shape({
    teamMember: Yup.string().required("Team member is required"),
    task: Yup.string().required("Task description is required"),
  });
  const handleModel = (isOpen, type) => {
    setModal({ isOpen: isOpen, type: type });
  };

  const handleRemove = (id) => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const getTask = storedTasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(getTask));
    handleModel(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (modal?.type === "Edit") {
        let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = storedTasks.findIndex((task) => task.id === editId);
        if (index !== -1) {
          storedTasks[index] = values;
        }

        localStorage.setItem("tasks", JSON.stringify(storedTasks));
        handleModel(false);
        formik.resetForm();
        return;
      }
      const obj = {
        ...values,
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        user: "hrishi",
      };
      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

      const updatedTasks = [...storedTasks, obj];

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      formik.resetForm();
      handleModel(false);
    },
  });

  const handleEdit = (id) => {
    setEditId(id);
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const getTask = storedTasks.find((task) => task.id === id);
    formik.setFieldValue("teamMember", getTask.teamMember);
    formik.setFieldValue("task", getTask.task);
    formik.setFieldValue("priority", getTask.priority);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div className="App">
      <section className="vh-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-12 col-xl-10">
              <div>
              <button
                type="button"
                className="btn btn-success btn-rounded"
                onClick={() => handleModel(true, "Add")}
              >
                Add task
              </button>
              </div>
              <div className="card mask-custom">
                <div className="card-body p-4 text-white">
                  <div className="text-center pt-3 pb-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-todo-list/check1.webp"
                      alt="Check"
                      width="60"
                    />
                    <h2 className="my-4">Task List</h2>
                  </div>

                  <table className="table text-white mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Team Member</th>
                        <th scope="col">Task</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.length > 0 ?
                        tasks.map((task, index) => (
                          <tr className="fw-normal" key={index}>
                            <th>
                              <span className="ms-2">{task.teamMember}</span>
                            </th>
                            <td className="align-middle">
                              <span>{task.task}</span>
                            </td>
                            <td className="align-middle">
                              <h6 className="mb-0">
                                <span
                                  className={`badge bg-${
                                    task.priority === "high"
                                      ? "danger"
                                      : task.priority === "medium"
                                      ? "warning"
                                      : "success"
                                  }`}
                                >
                                  {task.priority.charAt(0).toUpperCase() +
                                    task.priority.slice(1)}{" "}
                                  priority
                                </span>
                              </h6>
                            </td>
                            <td
                              className="align-middle d-flex"
                              style={{ gap: "15px" }}
                            >
                              <div
                                href="#!"
                                data-mdb-tooltip-init
                                title="Done"
                                onClick={() => {
                                  handleEdit(task.id);
                                  handleModel(true, "Edit");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="25"
                                  height="25"
                                  fill="currentColor"
                                  className="text-warning"
                                  viewBox="0 0 16 16"
                                  data-toggle="modal"
                                  data-target="#exampleModal"
                                >
                                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                                </svg>
                              </div>
                              <div
                                href="#!"
                                data-mdb-tooltip-init
                                title="Remove"
                                onClick={() => handleRemove(task.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="25"
                                  height="25"
                                  fill="currentColor"
                                  className="text-danger ms-2"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                </svg>
                              </div>
                            </td>
                          </tr>
                        )) :
                        
                        <div className="d-flex align-items-center mx-auto">
                          <span>Data not found</span>
                        </div>
                        }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model */}

      <Modal isOpen={modal.isOpen} style={customStyles}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{`${modal.type} Task`}</h5>
              <button
                type="button"
                className="close"
                onClick={() => handleModel(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="teamMember" className="form-label">
                    Team Member
                  </label>
                  <input
                    type="text"
                    id="teamMember"
                    name="teamMember"
                    className="form-control custom-input"
                    placeholder="Enter team member name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.teamMember}
                  />
                  {formik.touched.teamMember && formik.errors.teamMember ? (
                    <div className="text-danger">
                      {formik.errors.teamMember}
                    </div>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label htmlFor="task" className="form-label">
                    Task
                  </label>
                  <input
                    type="text"
                    id="task"
                    name="task"
                    className="form-control custom-input"
                    placeholder="Enter task description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.task}
                  />
                  {formik.touched.task && formik.errors.task ? (
                    <div className="text-danger">{formik.errors.task}</div>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label htmlFor="priority" className="form-label">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="form-select custom-select"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.priority}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleModel(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
