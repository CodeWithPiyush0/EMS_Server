import User from "../models/User.js"
import bcrypt from 'bcrypt'

const changePassword = async (req, res) => {
    try{
        const {userID, oldPassword, newPassword} = req.body

        const user = await User.findById({_id: userID})

        if(!user){
            return res.status(404).json({success: false, error: "User not found"})
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)

        if(!isMatch){
            return res.status(404).json({success: false, error: "Wrong old password"})
        }

        const hashPassword = await bcrypt.hash(newPassword, 10)

        const newUser = await User.findByIdAndUpdate({_id: userID}, {password: hashPassword})

        return res.status(200).json({success: true, message: "Password changed successfully"})


    } catch(error){
        console.error("Error in changePassword:", error);
        return res.status(500).json({success: false, error: "Setting error"})
    }
}

export { changePassword }