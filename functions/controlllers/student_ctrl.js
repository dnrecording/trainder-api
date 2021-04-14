'use strict';
const {admin} = require('../database');
const Student = require('../models/student');
const db = admin.firestore();

const addStudent = async(req,res,next) =>{
    try{
        const data =req.body;
        await db.collection('students').doc().set(data);
        res.send('Record saved successfully');

    }catch(error){
        res.status(400).send(error.message);

    }
}
const getAllStudents = async(req,res,next)=>{
    try {
        const students = await db.collection('students');
        const data = await students.get();
        const studentArray =  [];
        if(data.empty){
            res.status(404).send('No Student record Found');

        }else {
            data.forEach(doc =>{
                const student = new Student(doc.id,doc.data().firstName,doc.data().lstname);
                studentArray.push(student);
            })
            res.send(studentArray);

        }

    }
    catch(error){
        res.status(400).send(error.message);
    }
}
const getStudent  = async(req,res,next)=>{
    try{
        const id = req.params.id;
        const student = await db.collection('students').doc(id);
        const data = await student.get();
        if(!data.exists){
            res.status(404).send('Student with the given ID not found');

        }else {
            res.send(data.data());

        }
    }catch(error){
        res.status(400).send(error.message)
    }
}
const updateStudent = async(req,res,next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const student = await db.collection('students').doc(id);
        await student.update(data);
        res.send('Student record update successfully');


    }catch(error){
        res.status(400).send(error.message);
    }
}
const deleteStudent = async(req,res,next)=>{
    try {
        const id  = req.params.id;
        await db.collection('students').doc(id).delete();
        res.send('Record deleted successfully ');

    }catch(error){
        res.status(400).send(error.message);
    }
}

module.exports = {
    addStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent
}