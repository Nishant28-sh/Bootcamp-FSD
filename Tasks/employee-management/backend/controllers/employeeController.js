const employees = require("../data/employees");

// ─── GET ALL EMPLOYEES ────────────────────────────────────────────────────────
const getAllEmployees = (req, res) => {
  const { department, minSalary, maxSalary, search } = req.query;

  let result = [...employees];

  if (department) {
    result = result.filter(
      (e) => e.department.toLowerCase() === department.toLowerCase()
    );
  }
  if (minSalary) result = result.filter((e) => e.salary >= Number(minSalary));
  if (maxSalary) result = result.filter((e) => e.salary <= Number(maxSalary));
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(q));
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
};

// ─── GET SINGLE EMPLOYEE ──────────────────────────────────────────────────────
const getEmployeeById = (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "ID must be a number" });
  }

  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  res.status(200).json({ success: true, data: employee });
};

// ─── ADD EMPLOYEE ─────────────────────────────────────────────────────────────
const addEmployee = (req, res) => {
  const { name, department, salary } = req.body;

  if (!name || !department || salary === undefined) {
    return res.status(400).json({
      success: false,
      message: "name, department, and salary are required",
    });
  }

  if (typeof salary !== "number" || salary <= 0) {
    return res.status(400).json({
      success: false,
      message: "salary must be a positive number",
    });
  }

  const newEmployee = {
    id: employees.length ? Math.max(...employees.map((e) => e.id)) + 1 : 1,
    name: name.trim(),
    department: department.trim(),
    salary,
  };

  employees.push(newEmployee);

  res.status(201).json({
    success: true,
    message: "Employee added successfully",
    data: newEmployee,
  });
};

// ─── UPDATE EMPLOYEE ──────────────────────────────────────────────────────────
const updateEmployee = (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "ID must be a number" });
  }

  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  const { name, department, salary } = req.body;

  if (salary !== undefined && (typeof salary !== "number" || salary <= 0)) {
    return res.status(400).json({
      success: false,
      message: "salary must be a positive number",
    });
  }

  if (name)             employee.name       = name.trim();
  if (department)       employee.department = department.trim();
  if (salary !== undefined) employee.salary = salary;

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: employee,
  });
};

// ─── DELETE EMPLOYEE ──────────────────────────────────────────────────────────
const deleteEmployee = (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "ID must be a number" });
  }

  const index = employees.findIndex((emp) => emp.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  const [deleted] = employees.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
    data: deleted,
  });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
