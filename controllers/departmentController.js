import Department from "../models/Department.js"

const getDepartments = async(req, res) => {
    try {
        const departments = await Department.find()
        return res.status(200).json({success: true, departments})
    } catch (error) {
        return res.status(500).json({success: false, error: "get department server error"})   
    }
}


const addDepartment = async (req, res) => {
    try {
        const {dept_name, description} = req.body

        const existingDept = await Department.findOne({ dept_name });
        if (existingDept) {
            return res.status(400).json({ success: false, error: "Department already exists" });
        }

        const newDept = new Department({
            dept_name,
            description
        })
        await newDept.save()

        return res.status(200).json({success:true, department: newDept})
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: "Department name must be unique" });
        }

        return res.status(500).json({success: false, error: "add department server error"})
    }
}

const getDepartment = async(req, res) => {
    try {
        const {id} = req.params;
        const department = await Department.findById({_id: id})
        return res.status(200).json({success: true, department})
    } catch (error) {
        return res.status(500).json({success: false, error: "get department server error"})
    }
}

const updateDepartment = async(req, res) => {
    try {
        const {id} = req.params
        const {dept_name, description} = req.body
        const updateDept = await Department.findByIdAndUpdate({_id: id}, {
            dept_name,
            description,
        })
        return res.status(200).json({success: true, updateDept})
    } catch (error) {
        return res.status(500).json({success: false, error: "edit department server error"})
    }
}

const deleteDepartment = async (req, res) => {
    try {
        const {id} = req.params
        const deleteDept = await Department.findById({_id: id})
        await deleteDept.deleteOne()
        return res.status(200).json({success: true, deleteDept})
    } catch (error) {
        return res.status(500).json({success: false, error: "delete department server error"})
    }
}

export {addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment} 
