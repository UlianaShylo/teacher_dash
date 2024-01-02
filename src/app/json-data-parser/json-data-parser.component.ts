import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentGraphComponent } from '../student-graph/student-graph.component';

@Component({
  selector: 'app-json-data-parser',
  templateUrl: './json-data-parser.component.html',
  styleUrls: ['./json-data-parser.component.scss']
})
export class JsonDataParserComponent implements OnInit {
  optionsArray: number[] = [];
  selectedOption: number | undefined;
  jsonData: any;

  @ViewChild(StudentGraphComponent) studentGraphComponent: StudentGraphComponent | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('assets/testData.json').subscribe((data: any) => {
      this.jsonData = data;
      const uniqueStudentIds = new Set<number>();

      data.forEach((item: any) => {
        const chapters = item.chapters;
        for (const chapterKey in chapters) {
          if (chapters.hasOwnProperty(chapterKey)) {
            const chapter = chapters[chapterKey];
            const students = chapter.students || [];

            students.forEach((student: any) => {
              const studentId = student.student_id;
              uniqueStudentIds.add(studentId);
            });
          }
        }
      });

      this.optionsArray = Array.from(uniqueStudentIds);
    });
  }

  onOptionSelected() {
    if (this.selectedOption !== undefined) {
      console.log('Selected option:', this.selectedOption);
  
      const selectedStudents = this.findStudentsById(Number(this.selectedOption));

      if (selectedStudents.length > 0) {
        console.log('Selected Students:');
        selectedStudents.forEach(student => {
          console.log('Domain:', student.domain);
          console.log('Competency:', student.competency);
          console.log('Level:', student.level);
          console.log('Chapter:', student.chapter_name);
          console.log('Student ID:', student.student_id);
          console.log('Ignorance Rate:', student.ignorance_rate);
          console.log('Weight:', student.weight);
          console.log('Success:', student.success);
          console.log('Timestamp:', student.timestamp);
        });
        this.displayStudentGraph(selectedStudents); 
      } else {
        console.error('Selected student not found.');
      }
    }
  }
  
  findStudentsById(studentId: number) {
    const matchingStudents: any[] = [];
  
    if (this.jsonData) {
      this.jsonData.forEach((item: { referential: any; domain: any; competency: any; level: any; coni_pid: any; chapters: any; }) => {
        const domain = item.domain;
        const competency = item.competency;
        const level = item.level;
        const coni_pid = item.coni_pid;
        const chapters = item.chapters;
  
        for (const chapterKey in chapters) {
          if (chapters.hasOwnProperty(chapterKey)) {
            const chapter = chapters[chapterKey];
            const students = chapter.students || [];
  
            for (const student of students) {
              if (student.student_id === studentId) {
                // Include additional information in the selected student object
                student.domain = domain;
                student.competency = competency;
                student.level = level;
                student.coni_pid = coni_pid;
                student.chapters = chapters;
  
                matchingStudents.push(student);
              }
            }
          }
        }
      });
    }
  
    return matchingStudents;
  }
  

  displayStudentGraph(studentData: any[]) {
    if (this.studentGraphComponent !== undefined) {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!");
      this.studentGraphComponent.createGraph(studentData);
    }
  }
  
}
