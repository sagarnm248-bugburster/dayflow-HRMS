const { getDB } = require('../../config/db');
const ObjectId = require('mongodb').ObjectId;

// Default Salary Structure Template
const DEFAULT_SALARY_STRUCTURE = {
  components: [
    { name: "Basic", type: "percentage", value: 50, description: "50% of wage" },
    { name: "HRA", type: "percentage", value: 50, description: "50% of basic" },
    { name: "DA", type: "fixed", value: 4167, description: "Dearness Allowance" },
    { name: "PB", type: "percentage", value: 8.33, description: "8.33% of wage" },
    { name: "LTA", type: "percentage", value: 8.333, description: "Leave Travel Allowance" }
  ],
  deductions: [
    { name: "PF", type: "percentage", value: 12, description: "Provident Fund - 12% of wage" },
    { name: "Professional Tax", type: "fixed", value: 200, description: "Professional Tax" }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

// ✅ Get Global Salary Structure (or create if doesn't exist)
exports.getGlobalSalaryStructure = async (req, res) => {
  try {
    const db = getDB();
    let structure = await db.collection("globalSalaryStructure").findOne({});

    // Create default if doesn't exist
    if (!structure) {
      const result = await db.collection("globalSalaryStructure").insertOne(DEFAULT_SALARY_STRUCTURE);
      structure = await db.collection("globalSalaryStructure").findOne({ _id: result.insertedId });
      return res.status(201).json({
        message: "Global salary structure created with defaults",
        data: structure
      });
    }

    return res.status(200).json({
      message: "Global salary structure retrieved",
      data: structure
    });
  } catch (error) {
    console.error("Error fetching salary structure:", error);
    res.status(500).json({ message: "Error fetching salary structure", error: error.message });
  }
};

// ✅ Update Global Salary Structure (Admin only)
exports.updateGlobalSalaryStructure = async (req, res) => {
  try {
    const db = getDB();
    const { components, deductions } = req.body;

    if (!components || !deductions) {
      return res.status(400).json({ message: "Components and deductions are required" });
    }

    const updateData = {
      components,
      deductions,
      updatedAt: new Date()
    };

    const result = await db.collection("globalSalaryStructure").updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    const updatedStructure = await db.collection("globalSalaryStructure").findOne({});

    return res.status(200).json({
      message: "Salary structure updated successfully",
      data: updatedStructure
    });
  } catch (error) {
    console.error("Error updating salary structure:", error);
    res.status(500).json({ message: "Error updating salary structure", error: error.message });
  }
};

// ✅ Calculate Salary Components for a given wage
exports.calculateSalaryComponents = async (wage) => {
  try {
    const db = getDB();
    const structure = await db.collection("globalSalaryStructure").findOne({});

    if (!structure) {
      throw new Error("Global salary structure not found");
    }

    const components = structure.components;
    const deductions = structure.deductions;

    let calculatedComponents = {};
    let totalAllowances = 0;

    // Calculate all allowances (except "Fixed" which is calculated last)
    for (let component of components) {
      if (component.name === "Fixed") continue; // Skip for now

      if (component.type === "percentage") {
        let value;
        if (component.name === "HRA") {
          // HRA is percentage of Basic
          const basic = Math.round((wage * components[0].value) / 100);
          value = Math.round((basic * component.value) / 100);
        } else {
          value = Math.round((wage * component.value) / 100);
        }
        calculatedComponents[component.name.toLowerCase()] = value;
        totalAllowances += value;
      } else if (component.type === "fixed") {
        calculatedComponents[component.name.toLowerCase()] = component.value;
        totalAllowances += component.value;
      }
    }

    // Calculate "Fixed" component (wage - total allowances)
    const fixedAmount = wage - totalAllowances;
    calculatedComponents.fixed = Math.max(fixedAmount, 0);

    // Calculate deductions
    let totalDeductions = 0;
    for (let deduction of deductions) {
      if (deduction.type === "percentage") {
        const value = Math.round((wage * deduction.value) / 100);
        calculatedComponents[deduction.name.toLowerCase().replace(/\s/g, '')] = -value;
        totalDeductions += value;
      } else if (deduction.type === "fixed") {
        calculatedComponents[deduction.name.toLowerCase().replace(/\s/g, '')] = -deduction.value;
        totalDeductions += deduction.value;
      }
    }

    // Calculate totals
    calculatedComponents.totalDeductions = totalDeductions;
    calculatedComponents.totalGross = wage;
    calculatedComponents.netSalary = wage - totalDeductions;

    return calculatedComponents;
  } catch (error) {
    console.error("Error calculating salary components:", error);
    throw error;
  }
};

// ✅ Preview Endpoint - Calculate for specific wage
exports.calculateSalaryPreview = async (req, res) => {
  try {
    const { wage } = req.body;

    if (!wage || wage <= 0) {
      return res.status(400).json({ message: "Valid wage amount is required" });
    }

    const components = await exports.calculateSalaryComponents(wage);

    return res.status(200).json({
      message: "Salary preview calculated",
      data: components
    });
  } catch (error) {
    console.error("Error calculating preview:", error);
    res.status(500).json({ message: "Error calculating salary preview", error: error.message });
  }
};
