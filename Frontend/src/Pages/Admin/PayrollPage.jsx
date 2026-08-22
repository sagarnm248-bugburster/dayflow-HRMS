import React, { useState,useEffect } from "react";
import { FaDownload, FaEnvelope, FaPhone, FaGlobe, FaCalendarAlt,FaRupeeSign,FaRegClock } from "react-icons/fa";
import "chart.js/auto";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {cacheUser} from '../../Redux/Slice';
import { API_BASE_URL } from "../../config/api";


const PayrollPage = () => {
  const [tab, setTab] = useState("usersalaryinfo");

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-64px)]">
            <Profile />
            <div className="flex-1 bg-white p-6 rounded-2xl shadow-md flex flex-col">
              <nav className="flex gap-4 border-b pb-3 mb-4 text-sm font-medium">
                {["usersalaryinfo"].map((t) => (
                  <button
                    key={t}
                    className={`capitalize px-4 py-2 rounded-lg transition ${
                      tab === t ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setTab(t)}
                  >
                    {t.replace("info", " Info")}
                  </button>
                ))}
              </nav>

              <div className="flex-1 overflow-y-auto">
                {tab === "usersalaryinfo" && <InfoTab />} 
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

const Profile = () =>{
  const {id}=useParams();      
  console.log(id)
  const dispatch = useDispatch();
  const usersdata = useSelector((state) => state.auth.usersdata);
  console.log(usersdata)
  const [employee,setEmployee]=useState(null)
console.log("1. Profile rendered");
useEffect(()=>{
if (usersdata[id]){
  console.log("Loaded from cache",usersdata)
    console.log("2. Profile useEffect triggered");
  setEmployee(usersdata[id])
}else{
const FetchEmployee = async()=>{
  try{
  
    
    const response= await fetch(`${API_BASE_URL}/users/${id}`);
    
      if(!response.ok){
            throw new Error("Failed to fetch employees");
      }
       const data=await response.json()
       setEmployee(data.user)
       dispatch(cacheUser({ id, userData: data.user }));
       console.log('Fetching the data from api')
         
  }catch(error){
  console.error("Error fetching employees:", error);
  }
}
FetchEmployee();
};
},[id,dispatch,cacheUser])

  if (!employee) return (
    <div className="bg-white w-full lg:w-1/5 rounded-2xl shadow-md p-6 text-sm text-gray-700 space-y-6 animate-pulse">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 shadow"></div>
        <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-3 w-12 bg-gray-200 rounded mb-3"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded mt-0.5"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
console.log(employee)

  return (
 <div className="bg-white w-full lg:w-1/5 rounded-2xl shadow-md p-6 text-sm text-gray-700 space-y-6">
  {/* Profile Header */}
  <div className="flex flex-col items-center text-center">
      <img src="https://i.pravatar.cc/100?img=56" alt="Employee" className="w-24 h-24 rounded-full mb-4 shadow" />
      <h3 className="text-lg font-semibold">{employee.username}</h3>
      <p className="text-sm text-gray-500">UX Designer</p>
    </div>

  {/* Info Section */}
  <div>
    <h4 className="text-xs font-semibold text-gray-500 mb-3">Info</h4>
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-100 rounded-md">
        <FaEnvelope className="text-gray-500 mt-1" />
        </div>
        <div>
          <p className="text-sm font-medium">Admin & HRM</p>
          <p className="text-xs text-gray-400">Department</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-100 rounded-md">
        <FaRupeeSign className="text-gray-500 mt-1" />
        </div>
        <div>
          <p className="text-sm font-medium text-green-600">{employee.
salary}</p>
          <p className="text-xs text-gray-400">Salary</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-100 rounded-md">
        <FaRegClock  className="text-gray-500 mt-1" />
        </div>
        <div>
          <p className="text-sm font-medium">Regular</p>
          <p className="text-xs text-gray-400">Work Shift</p>
        </div>
      </div>
    </div>
  </div>

  {/* Contact Section */}
  <div>
    <h4 className="text-xs font-semibold text-gray-500 mb-3">Contact</h4>
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <FaEnvelope className="text-gray-500 mt-1" />
        <div>
          <p className="text-xs text-gray-500">Email</p>
          <p className="text-sm">{employee.email}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <FaPhone className="text-gray-500 mt-1" />
        <div>
          <p className="text-xs text-gray-500">Phone</p>
          <p className="text-sm">{employee.mobile}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <FaGlobe className="text-gray-500 mt-1" />
        <div>
          <p className="text-xs text-gray-500">Website</p>
          <a href="https://bit.ly/3uOJF79" className="text-sm text-blue-600 underline">
            https://bit.ly/3uOJF79
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

)};


function InfoTab() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState("Loading...");
  const [showAddButton, setShowAddButton] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchSalaryInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/usersalaryinfo/${id}`);

        if (!response.ok) {
          setMessage("Salary data is not found for this user. Please add the user info.");
          setShowAddButton(true);
          return;
        }

        const data = await response.json();
        setEmployee(data);
        setShowAddButton(false);
      } catch (error) {
        console.error("Error fetching salary info:", error);
        setMessage("Something went wrong while fetching salary info.");
      }
    };

    fetchSalaryInfo();
  }, [id]);

  const openModal = (mode, data = null) => {
    setFormMode(mode);
    setSelectedEmployeeData(data);
    setShowModal(true);
  };  

  return (
    <div className="space-y-6 text-gray-700">
      {!employee && message.startsWith("Loading") ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : employee ? (
        <>
          <h3 className="text-xl font-semibold border-b pb-2">
            User {employee.user_id} Salary Info
          </h3>

          {/* Personal Info */}
          <div>
            <h4 className="text-md font-semibold mb-2 text-indigo-600">👤 Personal Details</h4>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <p><span className="font-medium">Full Name:</span> {employee.employee_name}</p>
              <p><span className="font-medium">Employee ID:</span> {employee.employee_id}</p>
              <p><span className="font-medium">Status:</span> <span className={`font-semibold ${employee.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{employee.status || 'N/A'}</span></p>
              <p><span className="font-medium">Joining Date:</span> {employee.joining_date}</p>
            </div>
          </div>

          {/* Salary Components - Allowances */}
          <div>
            <h4 className="text-md font-semibold mb-2 text-green-600">💰 Salary Components (Allowances)</h4>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <p><span className="font-medium">Basic:</span> ₹{employee.basic || 0}</p>
              <p><span className="font-medium">HRA:</span> ₹{employee.hra || 0}</p>
              <p><span className="font-medium">DA (Dearness Allowance):</span> ₹{employee.da || 0}</p>
              <p><span className="font-medium">PB (Performance Bonus):</span> ₹{employee.pb || 0}</p>
              <p><span className="font-medium">LTA (Leave Travel Allow.):</span> ₹{employee.lta || 0}</p>
              <p><span className="font-medium">Fixed Allowance:</span> ₹{employee.fixed || 0}</p>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h4 className="text-md font-semibold mb-2 text-red-600">📉 Deductions</h4>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <p><span className="font-medium">PF (Amount):</span> ₹{employee.pf || 0}</p>
              <p><span className="font-medium">Professional Tax:</span> ₹{employee.professionaltax || 0}</p>
              <p><span className="font-medium">Total Deductions:</span> ₹{employee.total_deductions || 0}</p>
            </div>
          </div>

          {/* Salary Summary */}
          <div>
            <h4 className="text-md font-semibold mb-2 text-blue-600">📊 Salary Summary</h4>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <p><span className="font-medium">Gross Salary:</span> <span className="text-blue-600 font-semibold">₹{employee.gross_salary || 0}</span></p>
              <p><span className="font-medium">Net Salary:</span> <span className="text-green-700 font-semibold">₹{employee.net_salary || 0}</span></p>
            </div>
          </div>

          {/* Update Info */}
          <div>
            <h4 className="text-md font-semibold mb-2 text-indigo-600">🔄 Updates</h4>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <p><span className="font-medium">Updated By:</span> {employee.updated_by}</p>
              <p><span className="font-medium">Last Update:</span> {(employee.last_update).split("T")[0]}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4">
            <button
              onClick={() => openModal("update", employee)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              ✏️ Update Salary Info
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-red-600 font-medium">{message}</p>

          {showAddButton && (
            <button
              onClick={() => openModal("add")}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              ➕ Add Salary Info
            </button>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <SalaryModal
          mode={formMode}
          employeeId={id}
          defaultData={formMode === "update" ? selectedEmployeeData : {}}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}


const SalaryModal = ({ mode = "add", employeeId, defaultData = {}, onClose }) => {
    const user = useSelector((state) => state.auth.user);
    console.log("Hr data is",user.username)
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    basic: "",
    hra: "",
    da: "",
    pb: "",
    lta: "",
    fixed: "",
    pf: "",
    professionaltax: "",
    gross_salary: "",
    net_salary: "",
    total_deductions: "",
    status: "active",
    joining_date: "",
    updated_by: user.username,
  });

  const [message, setMessage] = useState("");
  

  // Pre-fill form for update
  useEffect(() => {
    if (mode === "update" && defaultData) {
      setFormData({ ...defaultData });
    } else {
      setFormData((prev) => ({ ...prev, employee_id: employeeId }));
    }
  }, [defaultData, mode, employeeId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      mode === "add"
        ? `${API_BASE_URL}/usersalaryinfo/add`
        : `${API_BASE_URL}/usersalaryinfo/update`;

    const method = mode === "add" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setMessage(result.message);
      setTimeout(() => {
        onClose(); // Close modal after success
      }, 1000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white max-w-4xl w-full rounded-xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-4 text-lg text-gray-500 hover:text-red-600">✖</button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          {mode === "add" ? "Add Salary Info" : "Update Salary Info"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} placeholder="Employee ID" disabled={mode === "update" || mode==="add"} className="border p-2 rounded bg-gray-100" />
            <input type="text" name="employee_name" value={formData.employee_name} onChange={handleChange} placeholder="Employee Name" className="border p-2 rounded" />
            <input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} placeholder="Joining Date" className="border p-2 rounded" />
            <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Salary Components */}
          <div className="border-t pt-3">
            <h4 className="font-semibold text-green-600 mb-2">💰 Salary Components (Allowances)</h4>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" name="basic" value={formData.basic} onChange={handleChange} placeholder="Basic" className="border p-2 rounded" />
              <input type="number" name="hra" value={formData.hra} onChange={handleChange} placeholder="HRA" className="border p-2 rounded" />
              <input type="number" name="da" value={formData.da} onChange={handleChange} placeholder="DA (Dearness Allowance)" className="border p-2 rounded" />
              <input type="number" name="pb" value={formData.pb} onChange={handleChange} placeholder="PB (Performance Bonus)" className="border p-2 rounded" />
              <input type="number" name="lta" value={formData.lta} onChange={handleChange} placeholder="LTA (Leave Travel Allow.)" className="border p-2 rounded" />
              <input type="number" name="fixed" value={formData.fixed} onChange={handleChange} placeholder="Fixed Allowance" className="border p-2 rounded" />
            </div>
          </div>

          {/* Deductions */}
          <div className="border-t pt-3">
            <h4 className="font-semibold text-red-600 mb-2">📉 Deductions</h4>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" name="pf" value={formData.pf} onChange={handleChange} placeholder="PF (Amount)" className="border p-2 rounded" />
              <input type="number" name="professionaltax" value={formData.professionaltax} onChange={handleChange} placeholder="Professional Tax" className="border p-2 rounded" />
              <input type="number" name="total_deductions" value={formData.total_deductions} onChange={handleChange} placeholder="Total Deductions" className="border p-2 rounded" />
            </div>
          </div>

          {/* Salary Summary */}
          <div className="border-t pt-3">
            <h4 className="font-semibold text-blue-600 mb-2">📊 Salary Summary</h4>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" name="gross_salary" value={formData.gross_salary} onChange={handleChange} placeholder="Gross Salary" className="border p-2 rounded" />
              <input type="number" name="net_salary" value={formData.net_salary} onChange={handleChange} placeholder="Net Salary" className="border p-2 rounded" />
            </div>
          </div>

          <input type="text" name="updated_by" value={formData.updated_by} onChange={handleChange} placeholder="updated_by" disabled className="border p-2 rounded bg-gray-100 col-span-2" />

          <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {mode === "add" ? "Add Info" : "Update Info"}
          </button>
        </form>

        {message && <p className="text-center text-sm mt-3 text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default PayrollPage;
