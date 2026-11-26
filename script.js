
let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};
let results = JSON.parse(localStorage.getItem("results")) || {};

function login() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    if(u === "admin" && p === "1234") {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        updateDashboard();
    } else {
        document.getElementById("error").innerText = "Invalid Login!";
    }
}

function logout() {
    location.reload();
}

function showSection(id) {
    document.querySelectorAll(".section").forEach(s => {
        s.style.display = "none";
    });
    document.getElementById(id).style.display = "block";

    if(id === "students") displayStudents();
    if(id === "attendance") displayAttendance();
    if(id === "home") updateDashboard();
}

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("attendance", JSON.stringify(attendance));
    localStorage.setItem("results", JSON.stringify(results));
}

function addStudent() {
    let name = document.getElementById("studentName").value.trim();
    let roll = document.getElementById("roll").value.trim();
    let course = document.getElementById("course").value.trim();

    if(!name || !roll || !course) {
        alert("Please fill all details");
        return;
    }

    if(students.some(s => s.roll === roll)) {
        alert("Roll number already exists");
        return;
    }

    students.push({name, roll, course});
    saveData();
    displayStudents();
    updateDashboard();

    document.getElementById("studentName").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("course").value = "";
}

function displayStudents() {
    let search = document.getElementById("search").value.toLowerCase();

    let list = students.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.roll.toLowerCase().includes(search)
    );

    document.getElementById("studentList").innerHTML =
    `<table>
    <tr><th>Name</th><th>Roll</th><th>Course</th></tr>
    ${list.map(s => `<tr>
    <td>${s.name}</td><td>${s.roll}</td><td>${s.course}</td>
    </tr>`).join("")}
    </table>`;
}

function getDate() {
    return document.getElementById("attDate").value ||
        new Date().toLocaleDateString("en-CA");
}

function displayAttendance() {
    let date = getDate();

    document.getElementById("attendanceList").innerHTML =
    `<table>
    <tr><th>Name</th><th>Roll</th><th>Status</th></tr>
    ${students.map(s => `
    <tr>
    <td>${s.name}</td>
    <td>${s.roll}</td>
    <td>
    <select id="att-${s.roll}">
    <option value="Present">Present</option>
    <option value="Absent">Absent</option>
    </select>
    </td>
    </tr>`).join("")}
    </table>`;

    students.forEach(s => {
        let status = attendance[date]?.[s.roll];
        if(status) {
            document.getElementById("att-" + s.roll).value = status;
        }
    });
}

function saveAttendance() {
    let date = getDate();
    attendance[date] = {};

    students.forEach(s => {
        attendance[date][s.roll] =
        document.getElementById("att-" + s.roll).value;
    });

    saveData();
    updateDashboard();
    alert("Attendance Saved Successfully!");
}

function calculateResult() {
    let roll = document.getElementById("resultRoll").value.trim();

    if(!students.some(s => s.roll === roll)) {
        alert("Student not found!");
        return;
    }

    let ids = ["m1","m2","m3","m4","m5"];
    let marks = ids.map(id => Number(document.getElementById(id).value));

    if(ids.some(id => document.getElementById(id).value === "") ||
       marks.some(m => !Number.isFinite(m) || m < 0 || m > 100)) {
        alert("Enter valid marks between 0 and 100!");
        return;
    }

    let total = marks.reduce((a,b) => a+b, 0);
    let percentage = total / 5;

    let grade = percentage >= 90 ? "A+" :
                percentage >= 80 ? "A" :
                percentage >= 70 ? "B" :
                percentage >= 60 ? "C" :
                percentage >= 40 ? "D" : "F";

    results[roll] = {marks, total, percentage, grade};
    saveData();

    document.getElementById("resultOutput").innerHTML =
    `<h3>Student Result</h3>
    <p>Total Marks: ${total}/500</p>
    <p>Percentage: ${percentage.toFixed(2)}%</p>
    <p>Grade: ${grade}</p>
    <p>Status: ${percentage >= 40 ? "PASS" : "FAIL"}</p>`;
}

function updateDashboard() {
    let date = getDate();

    document.getElementById("total").innerText = students.length;

    let today = attendance[date] || {};

    document.getElementById("present").innerText =
        Object.values(today).filter(x => x === "Present").length;

    document.getElementById("absent").innerText =
        Object.values(today).filter(x => x === "Absent").length;
}

document.getElementById("attDate").value =
    new Date().toLocaleDateString("en-CA");

document.getElementById("attDate").addEventListener("change", displayAttendance);
