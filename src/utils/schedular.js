import cron from 'node-cron';
import { createExcelReport } from './excelReport.js';

const schedular =()=>{ cron.schedule('28 14 * * *', async () => {
    try {
        await createExcelReport();  // Ensure you await the async function
        console.log('Excel report created successfully!');
      } catch (error) {
        console.error('Error creating Excel report:', error); // Catch any errors
      }
  
}
,{
    scheduled: true,
    timezone: "Asia/Kolkata"
}
)}
export {schedular};
