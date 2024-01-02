import { Component, OnInit } from '@angular/core';
import { PlotlyService } from '../plotly.service';

@Component({
  selector: 'app-student-graph',
  templateUrl: './student-graph.component.html',
  styleUrls: ['./student-graph.component.scss'],
})
export class StudentGraphComponent implements OnInit {
  timestamps: Date[] = [];
  averageIgnoranceRates: number[] = [];
  customColors: string[] = ['#FF5733', '#33FF57', '#5733FF', '#FFFF33']; 

  constructor(private plot: PlotlyService) {}

  ngOnInit(): void {}

  createGraph(studentData: any[]): void {
    this.processData(studentData);
  }

  processData(data: any[]): void {
    console.log(data);
    if (data) {
      console.log("data exists!!");
      const groupedData: Record<string, Record<string, any[]>> = {}; 
  
      data.forEach((item: any) => {
        if (item.chapters) {
          const chapters = item.chapters;
  
          for (const chapterKey in chapters) {
            if (chapters.hasOwnProperty(chapterKey)) {
              const chapter = chapters[chapterKey];
              const students = chapter.students || [];
  
              students.forEach((student: any) => {
                const timestamp = new Date(student.timestamp.replace(/\s/g, ''));
                const ignoranceRate = student.ignorance_rate;
  
                const studentRecord = {
                  timestamp,
                  ignoranceRate,
                  domain: item.domain,
                  competency: item.competency,
                  level: item.level,
                  chapterName: chapter.chapter_title,
                  studentId: student.student_id,
                  success: student.success 
                };
  
                if (!groupedData[item.domain]) {
                  groupedData[item.domain] = {};
                }
  
                if (!groupedData[item.domain][item.competency]) {
                  groupedData[item.domain][item.competency] = [];
                }
 
                groupedData[item.domain][item.competency].push(studentRecord);
              });
            }
          }
        }
      });
  
      this.createPlot(groupedData);
    }
  }
  
  createPlot(groupedData: Record<string, Record<string, any[]>>): void {
    console.log("Creating plots for multiple domains (chaque competence)");
  
    const traces: { x: Date[]; y: number[]; type: string; mode: string; name: string; line: { color: any } }[] = [];
    const customColors = this.customColors.slice(0, Object.keys(groupedData).length * Object.keys(groupedData[Object.keys(groupedData)[0]]).length);
  
    let colorIndex = 0;
  
    for (const domain in groupedData) {
      if (groupedData.hasOwnProperty(domain)) {
        for (const competency in groupedData[domain]) {
          const studentData = groupedData[domain][competency];
  
          // Sort studentData by timestamp
          studentData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
          const trace = {
            x: [] as Date[],
            y: [] as number[],
            type: 'scatter',
            mode: 'lines',
            name: `${domain} - ${competency}`,
            line: { 
              // shape: 'spline', // Je ne sais pas pourquoi ça ne fonctionne que pour une seule courbe =(
              // smoothing: 1.3,
              color: customColors[colorIndex++],             
              },

          };
  
          studentData.forEach((record) => {
            const timestamp = record.timestamp;
            const averageIgnoranceRate = this.calculateCustomFormulaRate(timestamp, studentData);
            trace.x.push(timestamp);
            trace.y.push(averageIgnoranceRate);
          });
  
          if (studentData.length === 0) {
            trace.y.push(100); // Default value if no data (if success == -2)
          }
  
          traces.push(trace);
        }
      }
    }
  
    const layout = {
      title: 'Evolution of Ignorance Rate Over Time',
      xaxis: { title: 'Timestamp' },
      yaxis: { title: 'Average Ignorance Rate' },
    };
  
    console.log(traces);
  
    this.plot.plot('ignoranceRateGraph', traces, layout);
  }
  
  calculateCustomFormulaRate(currentTimestamp: Date, studentData: any[]): number {
    const totalRates: Record<string, number> = {
      "experienced": 0,
      "elementary": 0,
      "independent": 0
    };
    const recordCounts: Record<string, number> = {
      "experienced": 0,
      "elementary": 0,
      "independent": 0
    };
  
    // Filter records that are less than or equal to the CURRENT timestamp
    const filteredRecords = studentData.filter((record) => record.timestamp <= currentTimestamp);
  
    // Group records by chapter and find the most recent record for each chapter
    const mostRecentRecordsByChapter: Record<string, any> = {};
  
    filteredRecords.forEach(record => {
      const chapterKey = record.chapterName;
      if (!mostRecentRecordsByChapter[chapterKey] || mostRecentRecordsByChapter[chapterKey].timestamp < record.timestamp) {
        mostRecentRecordsByChapter[chapterKey] = record;
      }
    });
  
    // Calculate total rates using the most recent records for each chapter
    Object.values(mostRecentRecordsByChapter).forEach((record) => {
      const level = record.level;
      if (totalRates.hasOwnProperty(level)) {
        totalRates[level] += record.ignoranceRate;
        recordCounts[level]++;
      }
    });
  
    // Calculate average rates
    const averageRates: Record<string, number> = {
      "experienced": recordCounts["experienced"] > 0 ? (totalRates["experienced"] / recordCounts["experienced"]) / 100 : 0,
      "elementary": recordCounts["elementary"] > 0 ? (totalRates["elementary"] / recordCounts["elementary"]) / 100 : 0,
      "independent": recordCounts["independent"] > 0 ? (totalRates["independent"] / recordCounts["independent"]) / 100 : 0
    };
    
    // Application de la formule qu'Ambroise m'a donné
    const result = averageRates["experienced"] * 101 + averageRates["elementary"] * 222 + averageRates["independent"] * 330;
    
    return result;
  }
  
  
}
