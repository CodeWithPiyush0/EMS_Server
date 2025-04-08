import mongoose from 'mongoose'
import multer from "multer"
import Employee from "../models/Employee.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import path from 'node:path'
import Department from '../models/Department.js'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

const addEmployee = async (req, res) => {

    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const {
            name,
            email,
            employeeId,
            dob,
            gender,
            martialStatus,
            designation,
            department,
            salary,
            password,
            role,
        } = req.body;
        console.log(req.body)

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, error: "User already registered in emp" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
            profileImage: req.file ? req.file.filename : ""
        })

        const savedUser = await newUser.save()

        const newEmployee = new Employee({
            userID: savedUser._id,
            employeeID: employeeId,
            dob,
            gender,
            martialStatus,
            designation,
            department,
            salary
        })

        await newEmployee.save()
        return res.status(200).json({ success: true, message: "employee created" })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Server error in adding employee" })
    }

}

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('userID', {password: 0}).populate("department")
        return res.status(200).json({ success: true, employees })
    } catch (error) {
        return res.status(500).json({ success: false, error: "get employees server error" })
    }
}

const getEmployee = async (req, res) => {
    const {id} = req.params;
    try {
        let employee;
        employee = await Employee.findById(id).populate('userID', {password: 0}).populate("department")

        if(!employee) {
            employee = await Employee.findOne({userID: id}).populate('userID', {password: 0}).populate("department")
        }

        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        return res.status(200).json({ success: true, employee })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error fetching employee details" })
    } 
}

const updateEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const {
            name,
            martialStatus,
            designation,
            department,
            salary,
        } = req.body;

        const employee = await Employee.findById({_id: id})
        if(!employee){
            return res.status(404).json({ success: false, error: "Employee not found" })
        }

        const user = await User.findById({_id: employee.userID})
        
        if(!user){
            return res.status(404).json({ success: false, error: "User not found" })
        }

        const updateUser = await User.findByIdAndUpdate({_id: employee.userID}, {name}, { new: true })

        const updateEmployee = await Employee.findByIdAndUpdate({_id: id}, {
            martialStatus,
            designation,
            salary,
            department
        }, { new: true })

        if(!updateEmployee || !updateUser){
            return res.status(500).json({ success: false, error: "Document not found" })
        }

        return res.status(200).json({success: true, message: "employee update"})

    } catch(error) {
        return res.status(500).json({ success: false, error: "Error updating employee details" })
    }
}

const fetchEmployeesByDeptId = async (req, res) =>{
    const {id} = req.params
    try {
        const employees = await Employee.find({department: id}).populate('userID', { password: 0 }).populate('department')

        return res.status(200).json({ success: true, employees})
   
    } catch(error){
        return res.status(500).json({ success: false, error: "get employeebyDeptId server error" })

    } 
}


export { addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDeptId }