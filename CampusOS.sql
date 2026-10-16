USE CampusOS;
GO

-- Eski Students tablosunu sil
DROP TABLE IF EXISTS Students;
GO

-- Tabloyu baştan oluştur
CREATE TABLE Students
(
    StudentId INT PRIMARY KEY,
    FullName NVARCHAR(100),
    Department NVARCHAR(100),
    Email NVARCHAR(100)
);
GO

-- Öğrenci ekle
INSERT INTO Students
(StudentId, FullName, Department, Email)
VALUES
(1, 'Mehmet Gol', 'MIS', 'A@GMAIL.COM');
GO
 INSERT INTO Students
(StudentId, FullName, Department, Email)
VALUES
(2, 'Ahmet Yilmaz', 'Computer Engineering', 'ahmet@gmail.com'),
(3, 'Ayse Kaya', 'MIS', 'ayse@gmail.com'),
(4, 'Ali Demir', 'Software Engineering', 'ali@gmail.com');

-- Kontrol et
SELECT * FROM Students;
GO

SELECT FullName from Students
WHERE Department = 'MIS'

SELECT Email from Students
WHERE StudentId =3

UPDATE Students

SET Department ='Computer Science'

WHERE StudentId = 2

SELECT StudentId,Department FROM Students
WHERE studentID =2

DELETE FROM Students
WHERE StudentId = 4

select *  from Students

CREATE TABLE Courses
(
    CourseId INT PRIMARY KEY,
    CourseName NVARCHAR(100),
    Credit INT
);

    
INSERT INTO Courses(CourseId,CourseName,Credit)
VALUES
(1,'Database Management Systems',3),
(2,'Algorithm and Data Structures',3),
(3,'Principles of Marketing',3)


CREATE TABLE Enrollments
(
    EnrollmentId INT PRIMARY KEY,
    StudentId INT,
    CourseId INT,

    FOREIGN KEY (StudentId)
        REFERENCES Students(StudentId),

    FOREIGN KEY (CourseId)
        REFERENCES Courses(CourseId)
);


INSERT INTO Enrollments
(EnrollmentId, StudentId, CourseId)
VALUES
(1, 1, 1);
INSERT INTO Enrollments
(EnrollmentId, StudentId, CourseId)
VALUES
(2, 1, 2);
SELECT * FROM Enrollments;

 
SELECT Students.FullName ,Courses.CourseName
FROM Enrollments
INNER JOIN Students 
ON Enrollments.StudentId = Students.StudentId
INNER JOIN Courses 
ON Enrollments.CourseId = Courses.CourseId




Update Students

SET 
Department = 'Computer Science',
Email = 'ayse.cs@gmail.com'

WHERE StudentId =3 

Select * from Students

DELETE  FROM  Students
WHERE StudentId = 1

select *  from Students 

SELECT Department, Count(*) FROM  Students
GROUP BY Department


SELECT Students.FullName,COUNT(*) AS 'StudentCount' ,Courses.CourseId , Count(*) AS 'CourseId' FROM Enrollments

INNER JOIN  Courses
ON Enrollments.CourseId = Courses.CourseId

INNER JOIN Students 

ON Enrollments.StudentId = Students.StudentId

GROUP BY Students.FullName,Courses.CourseId


INSERT INTO Enrollments
(EnrollmentId, StudentId, CourseId)
VALUES
(3, 2, 1),  -- Ahmet → Database
(4, 3, 3);  -- Ayşe → Marketing

SELECT * FROM Enrollments;

SELECT Students.FullName , Courses.CourseName  FROM Enrollments

INNER JOIN Students

ON Enrollments.StudentId = Students.StudentId

INNER JOIN  Courses
ON Enrollments.CourseId = Courses.CourseId 



SELECT  * FROM Enrollments

SELECT 
    Courses.CourseName,
    COUNT(*) AS StudentCount
FROM Enrollments
INNER JOIN Courses
    ON Enrollments.CourseId = Courses.CourseId
GROUP BY Courses.CourseName;


SELECT Courses.CourseName , COUNT(*) AS StudentCount FROM Enrollments

INNER JOIN Courses

ON Enrollments.CourseId = Courses.CourseId
GROUP BY Courses.CourseName
Having Count(*) >=2

SELECT Students.FullName, Courses.CourseName from Enrollments

LEFT JOIN  Students

ON Enrollments.StudentId = Students.StudentId

LEFT JOIN Courses
ON Enrollments.CourseId = Courses.CourseId




SELECT Students.FullName, Students.Department, 
Courses.CourseName,Courses.Credit 
FROM Students

LEFT JOIN Enrollments

ON Enrollments.StudentId = Students.StudentId

LEFT JOIN Courses

ON Enrollments.CourseId= Courses.CourseId

SELECT *
FROM Enrollments;


SELECT DB_NAME();

SELECT FullName, Department FROM

Students

WHERE Department ='MIS'



SELECT FullName, Department FROM

Students

WHERE Department ='Computer Science'


SELECT FullName,Department FROM Students
WHERE Department ='MIS'
UNION ALL
SELECT FullName,Department FROM Students
WHERE Department ='Computer Science'

SELECT FullName,Department FROM Students
WHERE Department ='MIS'
UNION
SELECT FullName,Department FROM Students
WHERE Department ='Computer Science'

ALTER TABLE Students
ADD Yasiki INT;
GO

INSERT INTO Students (StudentId, FullName, Department, Email, Yasiki)
VALUES
('Zeynep Demir', 'Computer Science', 'zeynep@gmail.com', 21),
( 'Ali Kaya', 'Software Engineering', 'ali@gmail.com', 19);
GO

SELECT StudentId, FullName, Yasiki
FROM Students;

SELECT StudentId, FullName, Yasiki 
FROM Students 
WHERE StudentId IN (6, 7);

UPDATE Students
SET Yasiki = 21
WHERE StudentId = 6;

UPDATE Students
SET Yasiki = 19
WHERE StudentId = 7;

SELECT StudentId, FullName, Yasiki
FROM Students;