package com.example.demo.service;

import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.StudentNotFoundException;
import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@AllArgsConstructor
@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        Boolean existsEmail = studentRepository.selectExistsEmail(student.getEmail());
        if (existsEmail) {
            throw new BadRequestException("Email " + student.getEmail() + " taken");
        }
        studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new StudentNotFoundException("Student with id " + studentId + " does not exists");
        }
        studentRepository.deleteById(studentId);
    }

    public void updateStudent(Student student) {
        Boolean existSEmail = studentRepository.selectExistsEmail(student.getEmail());
        if (existSEmail) {
            throw new BadRequestException("Student email " + student.getEmail() + " taken");
        }
        Student studentUpdate = studentRepository.findStudentById(student.getId())
                .orElseThrow(()-> new StudentNotFoundException("Student id " + student.getId() + " was not found"));
        studentUpdate.setGender(student.getGender());
        studentUpdate.setName(student.getName());
        studentUpdate.setEmail(student.getEmail());
        studentRepository.save(studentUpdate);
    }
}
