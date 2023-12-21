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
    // Call processData with studentData
    this.processData(studentData);
  }

  processData(data: any[]): void {
    console.log(data);
    if (data) {
      console.log("data exists!!");
      const groupedData: Record<string, any[]> = {}; // Object to store grouped data by domain

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
                // console.log(ignoranceRate);

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

                // Group data by domain
                if (!groupedData[item.domain]) {
                  groupedData[item.domain] = [];
                }
                groupedData[item.domain].push(studentRecord);
              });
            }
          }
        }
      });

      this.createPlot(groupedData);
    }
  }
  createPlot(groupedData: Record<string, any[]>): void {
    console.log("Creating plots for multiple domains");
  
    const traces: { x: Date[]; y: number[]; type: string; mode: string; name: string; line: { color: any } }[] = [];
    const customColors = this.customColors.slice(0, Object.keys(groupedData).length);
  
    for (const domain in groupedData) {
      if (groupedData.hasOwnProperty(domain)) {
        const studentData = groupedData[domain];
  
        studentData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
        const trace = {
          x: [] as Date[], 
          y: [] as number[], 
          type: 'scatter',
          mode: 'lines',
          name: `Average Ignorance Rate - ${domain}`,
          line: { color: customColors[Object.keys(groupedData).indexOf(domain)] },
        };
  
        const uniqueCombinations = new Set<string>(); 
  
        studentData.forEach((record) => {
          const timestamp = record.timestamp;
          const averageIgnoranceRate = this.calculateAverageIgnoranceRate(timestamp, studentData);
          const uniqueIdentifier = `${timestamp.getTime()}-${averageIgnoranceRate}`;
  
          if (!uniqueCombinations.has(uniqueIdentifier)) {
            uniqueCombinations.add(uniqueIdentifier);
            trace.x.push(timestamp);
            trace.y.push(averageIgnoranceRate);
          }
        });

        if (studentData.length === 0) {
          trace.y.push(100);
        }
  
        traces.push(trace);
      }
    }
  
    const layout = {
      title: 'Evolution of Ignorance Rate Over Time',
      xaxis: {
        title: 'Timestamp',
      },
      yaxis: {
        title: 'Average Ignorance Rate',
      },
    };
  
    const plotlyData = traces;
    console.log(plotlyData);
  
    this.plot.plot('ignoranceRateGraph', plotlyData, layout);
  }
  

  calculateAverageIgnoranceRate(currentTimestamp: Date, studentData: any[]): number {
    let totalRate = 0;
    let recordCount = 0;

    // Filter records that are less than or equal to the current timestamp
    const filteredRecords = studentData.filter((record) => record.timestamp <= currentTimestamp);

    if (filteredRecords.length === 0) {
      return 0;
    }

    // Set for delete the DUPLICATES
    const chapterGroups: Record<string, any[]> = {};

    filteredRecords.forEach((record) => {
      if (!chapterGroups[record.chapterName]) {
        chapterGroups[record.chapterName] = [];
      }
      chapterGroups[record.chapterName].push(record);
    });

    // Calculate the average for each chapter's most recent record
    for (const chapterName in chapterGroups) {
      if (chapterGroups.hasOwnProperty(chapterName)) {
        const chapterRecords = chapterGroups[chapterName];
        const mostRecentRecord = chapterRecords.reduce((prev, current) =>
          prev.timestamp > current.timestamp ? prev : current
        );

        totalRate += mostRecentRecord.ignoranceRate;
        recordCount++;
      }
    }

    if (recordCount === 0) {
      return 0;
    }

    // console.log(recordCount);
    return totalRate / recordCount;
  }
}
