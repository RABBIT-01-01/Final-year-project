"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

export default function Analytics() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    password: "",
    maintenance_team: "",
  });

  // const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users/", {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await fetch(`http://localhost:4000/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setFormData({
      fullname: user.fullname || "",
      phone: user.phone || "",
      password: "",
      maintenance_team: user.maintenance_team || "",
      logUser: user.logUser,
    });
  };

  const handleCancel = () => setEditingId(null);

  const handleSave = async (id) => {
    try {
      const body = { ...formData };
      if (!body.password) delete body.password;
      const res = await fetch(`http://localhost:4000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await fetchUsers();
        setEditingId(null);
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  if (loading) return <p>Loading users...</p>;

  const normalUsers = users.filter((u) => u.logUser === "user");
  const maintenanceTeam = users.filter((u) => u.logUser === "maintenance");

  const renderRow = (user) => {
    if (editingId === user._id) {
      return (
        <tr key={user._id} className="table-active animate__animated animate__fadeIn">
          <td>
            <input
              type="text"
              className="form-control"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            />
          </td>
          <td>{user.email}</td>
          <td>
            <input
              type="text"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </td>
          {user.logUser === "maintenance" && (
            <td>
              <input
                type="text"
                className="form-control"
                value={formData.maintenance_team}
                onChange={(e) =>
                  setFormData({ ...formData, maintenance_team: e.target.value })
                }
              />
            </td>
          )}
          <td>
            <input
              type="password"
              className="form-control mb-1"
              placeholder="New password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => handleSave(user._id)}
            >
              Save
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
              Cancel
            </button>
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={user._id} className="animate__animated animate__fadeIn">
          <td>{user.fullname}</td>
          <td>{user.email}</td>
          <td>{user.phone}</td>
          {user.logUser === "maintenance" && <td>{user.maintenance_team}</td>}
          <td>
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => handleEditClick(user)}
            >
              Update
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>
              Delete
            </button>
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Users</h2>
      <table className="table table-bordered table-striped shadow-sm">
        <thead className="table-primary">
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            {normalUsers.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>{normalUsers.map(renderRow)}</tbody>
      </table>

      <h2 className="mt-5 mb-3">Maintenance Team</h2>
      <table className="table table-bordered table-striped shadow-sm">
        <thead className="table-info">
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Team</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{maintenanceTeam.map(renderRow)}</tbody>
      </table>

     {/* Register Button */}
<div className="d-flex justify-content-center mt-5 mb-5">
  <button
    className="btn btn-lg btn-primary position-relative animate__animated animate__pulse"
    style={{
      padding: "15px 40px",
      fontSize: "1.2rem",
      borderRadius: "50px",
      boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
      transition: "all 0.3s ease",
    }}
    onClick={() => window.location.href = "/Maintanance_report"} // open page
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    Register
  </button>
</div>


      {/* Animate.css CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
    </div>
  );
}
