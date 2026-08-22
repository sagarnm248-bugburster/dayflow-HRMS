import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Wallet, Edit2, Save, X } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

const SalaryStructure = () => {
  const [structure, setStructure] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewWage, setPreviewWage] = useState("");
  const [preview, setPreview] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const token = localStorage.getItem("token");
  const apiBase = API_BASE_URL;

  // ✅ Fetch global salary structure
  useEffect(() => {
    fetchStructure();
  }, []);

  const fetchStructure = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiBase}/salary-structure`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStructure(response.data.data);
    } catch (error) {
      console.error("Error fetching structure:", error);
      toast.error("Failed to load salary structure");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle component value change
  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...structure.components];
    updatedComponents[index][field] = field === "value" ? parseFloat(value) : value;
    setStructure({ ...structure, components: updatedComponents });
  };

  // ✅ Handle deduction value change
  const handleDeductionChange = (index, field, value) => {
    const updatedDeductions = [...structure.deductions];
    updatedDeductions[index][field] = field === "value" ? parseFloat(value) : value;
    setStructure({ ...structure, deductions: updatedDeductions });
  };

  // ✅ Save structure changes
  const handleSaveStructure = async () => {
    try {
      setSaving(true);
      await axios.put(
        `${apiBase}/salary-structure`,
        {
          components: structure.components,
          deductions: structure.deductions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Salary structure updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving structure:", error);
      toast.error("Failed to save salary structure");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Calculate salary preview
  const handleCalculatePreview = async () => {
    if (!previewWage || previewWage <= 0) {
      toast.error("❌ Please enter a valid wage amount");
      return;
    }

    try {
      setCalculating(true);
      const response = await axios.post(
        `${apiBase}/salary-structure/preview`,
        { wage: parseFloat(previewWage) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPreview(response.data.data);
    } catch (error) {
      console.error("Error calculating preview:", error);
      toast.error("Failed to calculate salary preview");
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Wallet size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Global Salary Structure</h1>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Edit2 size={18} />
              Edit Structure
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Current Structure */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">📊 Current Structure</h2>

            {/* Allowances */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-green-600 mb-4">✅ Allowances</h3>
              <div className="space-y-3">
                {structure?.components.map((comp, idx) => (
                  <div key={idx} className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{comp.name}</span>
                      <span className="text-sm text-gray-600">{comp.description}</span>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={comp.name}
                          onChange={(e) => handleComponentChange(idx, "name", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                        <select
                          value={comp.type}
                          onChange={(e) => handleComponentChange(idx, "type", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded"
                        >
                          <option>percentage</option>
                          <option>fixed</option>
                        </select>
                        <input
                          type="number"
                          value={comp.value}
                          onChange={(e) => handleComponentChange(idx, "value", e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded"
                        />
                        <span className="text-gray-600">{comp.type === "percentage" ? "%" : "₹"}</span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-green-600">
                        {comp.type === "percentage" ? `${comp.value}%` : `₹${comp.value.toLocaleString()}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-4">🔴 Deductions</h3>
              <div className="space-y-3">
                {structure?.deductions.map((ded, idx) => (
                  <div key={idx} className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{ded.name}</span>
                      <span className="text-sm text-gray-600">{ded.description}</span>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={ded.name}
                          onChange={(e) => handleDeductionChange(idx, "name", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                        <select
                          value={ded.type}
                          onChange={(e) => handleDeductionChange(idx, "type", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded"
                        >
                          <option>percentage</option>
                          <option>fixed</option>
                        </select>
                        <input
                          type="number"
                          value={ded.value}
                          onChange={(e) => handleDeductionChange(idx, "value", e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded"
                        />
                        <span className="text-gray-600">{ded.type === "percentage" ? "%" : "₹"}</span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-red-600">
                        {ded.type === "percentage" ? `${ded.value}%` : `₹${ded.value.toLocaleString()}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveStructure}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchStructure();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Right: Salary Preview Calculator */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">🧮 Salary Preview Calculator</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Enter Monthly Wage (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={previewWage}
                  onChange={(e) => setPreviewWage(e.target.value)}
                  placeholder="e.g., 50000"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleCalculatePreview()}
                />
                <button
                  onClick={handleCalculatePreview}
                  disabled={calculating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {calculating ? "Calculating..." : "Calculate"}
                </button>
              </div>
            </div>

            {/* Preview Results */}
            {preview && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm text-gray-600">Monthly Wage</div>
                  <div className="text-2xl font-bold text-blue-600">₹{preview.totalGross?.toLocaleString()}</div>
                </div>

                {/* Allowances Preview */}
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✅ Allowances</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {preview.basic && (
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <div className="text-xs text-gray-600">Basic</div>
                        <div className="font-bold text-green-600">₹{preview.basic.toLocaleString()}</div>
                      </div>
                    )}
                    {preview.hra && (
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <div className="text-xs text-gray-600">HRA</div>
                        <div className="font-bold text-green-600">₹{preview.hra.toLocaleString()}</div>
                      </div>
                    )}
                    {preview.da && (
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <div className="text-xs text-gray-600">DA</div>
                        <div className="font-bold text-green-600">₹{preview.da.toLocaleString()}</div>
                      </div>
                    )}
                    {preview.pb && (
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <div className="text-xs text-gray-600">PB</div>
                        <div className="font-bold text-green-600">₹{preview.pb.toLocaleString()}</div>
                      </div>
                    )}
                    {preview.lta && (
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <div className="text-xs text-gray-600">LTA</div>
                        <div className="font-bold text-green-600">₹{preview.lta.toLocaleString()}</div>
                      </div>
                    )}
                    {preview.fixed && (
                      <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                        <div className="text-xs text-gray-600">Fixed</div>
                        <div className="font-bold text-yellow-600">₹{preview.fixed.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Deductions Preview */}
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">🔴 Deductions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {preview.pf && (
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <div className="text-xs text-gray-600">PF</div>
                        <div className="font-bold text-red-600">-₹{Math.abs(preview.pf).toLocaleString()}</div>
                      </div>
                    )}
                    {preview.professionaltax && (
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <div className="text-xs text-gray-600">Prof. Tax</div>
                        <div className="font-bold text-red-600">-₹{Math.abs(preview.professionaltax).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t-2 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-semibold">Gross Salary</span>
                    <span className="text-lg font-bold text-blue-600">₹{preview.totalGross?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-semibold">Total Deductions</span>
                    <span className="text-lg font-bold text-red-600">-₹{preview.totalDeductions?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-100 p-3 rounded-lg">
                    <span className="text-gray-800 font-bold">Net Salary</span>
                    <span className="text-2xl font-bold text-green-600">₹{preview.netSalary?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-blue-900 mb-2">💡 How it works</h3>
          <ul className="text-blue-800 space-y-1">
            <li>✓ This global salary structure applies to <strong>all employees</strong></li>
            <li>✓ When you add a new employee with a wage, components are <strong>automatically calculated</strong></li>
            <li>✓ Edit the structure above to change how salary is calculated for all future employees</li>
            <li>✓ Use the calculator to preview salary before adding an employee</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SalaryStructure;
