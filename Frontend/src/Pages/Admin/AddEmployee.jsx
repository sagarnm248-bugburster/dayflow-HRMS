import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    id: "",
    joigningDate: "",
    designation: "",
    address: "",
    bankAccount: "",
    mobile: "",
    email: "",
    role: "",
    wage: "",
    salary: "",
    salary_components: {},
    employmentType: "",
    attendanceType: "",
    emergencyContact: "",
    emergencyContactname: "",
    IFSC: "",
  });

  const [loading, setLoading] = useState(false);
  const [salaryPreview, setSalaryPreview] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const token = localStorage.getItem("token");
  const apiBase = API_BASE_URL;

  // ✅ Auto-calculate salary components when wage changes
  const handleWageChange = async (wage) => {
    if (!wage || wage <= 0) {
      setSalaryPreview(null);
      return;
    }

    try {
      setCalculating(true);
      const response = await axios.post(
        `${apiBase}/salary-structure/preview`,
        { wage: parseFloat(wage) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSalaryPreview(response.data.data);
      setFormData((prev) => ({
        ...prev,
        salary: response.data.data.totalGross || wage,
        salary_components: response.data.data,
      }));
    } catch (error) {
      console.error("Error calculating salary:", error);
      toast.error("Failed to calculate salary components");
      setSalaryPreview(null);
    } finally {
      setCalculating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // ✅ Trigger wage calculation
    if (name === "wage" && value) {
      handleWageChange(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Enhanced validations
    if (!formData.name || !formData.id || !formData.email || !formData.role) {
      toast.error("❌ Please fill all required fields");
      return;
    }

    if (formData.wage && formData.wage > 0) {
      if (!salaryPreview) {
        toast.error("❌ Please wait for salary preview to calculate");
        return;
      }
      if (!formData.salary_components || Object.keys(formData.salary_components).length === 0) {
        toast.error("❌ Salary components not calculated. Please ensure wage is entered.");
        return;
      }
    }

    try {
      setLoading(true);
      const response = await axios.post(`${apiBase}/add`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("✅ Employee added successfully with salary structure!");
        console.log("Server Response:", response.data);

        // Reset form
        setFormData({
          name: "",
          gender: "",
          id: "",
          joigningDate: "",
          designation: "",
          address: "",
          bankAccount: "",
          mobile: "",
          email: "",
          role: "",
          wage: "",
          salary: "",
          salary_components: {},
          employmentType: "",
          attendanceType: "",
          emergencyContact: "",
          emergencyContactname: "",
          IFSC: "",
        });
        setSalaryPreview(null);
      }
    } catch (error) {
      console.error("Full Error Object:", error);
      console.error("Error Response Data:", error.response?.data);
      console.error("Form Data Sent:", formData);
      const errorMsg = error.response?.data?.message || "Failed to add employee";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-6 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-6">Add Employee</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
        >
          {/* Employee Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Employee Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="ex. John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Employee ID *
            </label>
            <input
              type="text"
              name="id"
              placeholder="ex. CS001"
              value={formData.id}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Please Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Joining Date *
            </label>
            <input
              type="date"
              name="joigningDate"
              value={formData.joigningDate}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Designation *
            </label>
            <input
              type="text"
              name="designation"
              placeholder="ex. Software Engineer"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address *</label>
            <input
              type="text"
              name="address"
              placeholder="ex. House no, Society name, District, State"
              value={formData.address}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              placeholder="ex. abc@mail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium mb-1">Mobile *</label>
            <input
              type="text"
              name="mobile"
              placeholder="ex. 9876543210"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* ✅ NEW: Monthly Wage */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Monthly Wage (₹) *
            </label>
            <input
              type="number"
              name="wage"
              placeholder="ex. 50000"
              value={formData.wage}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
            {calculating && <p className="text-sm text-blue-600 mt-1">Calculating...</p>}
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Employment Type *
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          {/* Attendance Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Attendance Type *
            </label>
            <select
              name="attendanceType"
              value={formData.attendanceType}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {/* Bank Account */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Bank Account No. *
            </label>
            <input
              type="text"
              name="bankAccount"
              placeholder="ex. 1234567890123456"
              value={formData.bankAccount}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-sm font-medium mb-1">IFSC Code *</label>
            <input
              type="text"
              name="IFSC"
              placeholder="ex. HDFC0001234"
              value={formData.IFSC}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Emergency Contact
            </label>
            <input
              type="text"
              name="emergencyContact"
              placeholder="ex. 9876543210"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          {/* Emergency Contact Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Emergency Contact Name
            </label>
            <input
              type="text"
              name="emergencyContactname"
              placeholder="ex. John Doe"
              value={formData.emergencyContactname}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          {/* ✅ NEW: Salary Breakdown Preview */}
          {salaryPreview && (
            <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200 mt-4">
              <h3 className="text-lg font-bold text-blue-900 mb-4">📊 Salary Breakdown Preview</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {/* Allowances */}
                {salaryPreview.basic && (
                  <div className="bg-green-100 p-3 rounded border border-green-300">
                    <div className="text-xs text-gray-600 font-semibold">✅ Basic</div>
                    <div className="text-lg font-bold text-green-700">₹{salaryPreview.basic.toLocaleString()}</div>
                  </div>
                )}
                {salaryPreview.hra && (
                  <div className="bg-green-100 p-3 rounded border border-green-300">
                    <div className="text-xs text-gray-600 font-semibold">✅ HRA</div>
                    <div className="text-lg font-bold text-green-700">₹{salaryPreview.hra.toLocaleString()}</div>
                  </div>
                )}
                {salaryPreview.da && (
                  <div className="bg-green-100 p-3 rounded border border-green-300">
                    <div className="text-xs text-gray-600 font-semibold">✅ DA</div>
                    <div className="text-lg font-bold text-green-700">₹{salaryPreview.da.toLocaleString()}</div>
                  </div>
                )}
                {salaryPreview.pb && (
                  <div className="bg-green-100 p-3 rounded border border-green-300">
                    <div className="text-xs text-gray-600 font-semibold">✅ PB</div>
                    <div className="text-lg font-bold text-green-700">₹{salaryPreview.pb.toLocaleString()}</div>
                  </div>
                )}
                {salaryPreview.lta && (
                  <div className="bg-green-100 p-3 rounded border border-green-300">
                    <div className="text-xs text-gray-600 font-semibold">✅ LTA</div>
                    <div className="text-lg font-bold text-green-700">₹{salaryPreview.lta.toLocaleString()}</div>
                  </div>
                )}
                {salaryPreview.fixed !== undefined && (
                  <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
                    <div className="text-xs text-gray-600 font-semibold">🟡 Fixed</div>
                    <div className="text-lg font-bold text-yellow-700">₹{salaryPreview.fixed.toLocaleString()}</div>
                  </div>
                )}
                {salaryPreview.pf && (
                  <div className="bg-red-100 p-3 rounded border border-red-300">
                    <div className="text-xs text-gray-600 font-semibold">🔴 PF</div>
                    <div className="text-lg font-bold text-red-700">-₹{Math.abs(salaryPreview.pf).toLocaleString()}</div>
                  </div>
                )}
                {salaryPreview.professionaltax && (
                  <div className="bg-red-100 p-3 rounded border border-red-300">
                    <div className="text-xs text-gray-600 font-semibold">🔴 Prof. Tax</div>
                    <div className="text-lg font-bold text-red-700">-₹{Math.abs(salaryPreview.professionaltax).toLocaleString()}</div>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-200 p-3 rounded border border-blue-400 text-center">
                  <div className="text-xs text-gray-700 font-semibold">Gross</div>
                  <div className="text-lg font-bold text-blue-800">₹{salaryPreview.totalGross?.toLocaleString()}</div>
                </div>
                <div className="bg-red-200 p-3 rounded border border-red-400 text-center">
                  <div className="text-xs text-gray-700 font-semibold">Deductions</div>
                  <div className="text-lg font-bold text-red-800">-₹{salaryPreview.totalDeductions?.toLocaleString()}</div>
                </div>
                <div className="bg-green-200 p-3 rounded border border-green-400 text-center">
                  <div className="text-xs text-gray-700 font-semibold">Net</div>
                  <div className="text-lg font-bold text-green-800">₹{salaryPreview.netSalary?.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading || calculating}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding Employee..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
