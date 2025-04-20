import { GroupIcon, AlertIcon } from "../../icons";

export default function EcommerceMetrics() {
  const username = "admin"; // Replace with dynamic username if needed

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getTimeRemaining(dueDate: string) {
    const currentDate = new Date();
    const targetDate = new Date(dueDate);
    const timeDiff = targetDate.getTime() - currentDate.getTime();
    
    if (timeDiff <= 0) return "Overdue";  // In case the payment date has passed
    
    const daysRemaining = Math.floor(timeDiff / (1000 * 3600 * 24));
    return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}  left`;
  }
  

  return (
<div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
{/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-black">Dashboard</h1>
        <p className="text-gray-600 dark:text-black-400">Welcome back, {username}</p>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Left Column - Metrics + Upcoming Payments */}
        <div className="flex-1 space-y-6">
          {/* Metrics Row */}
          <div className="flex gap-6">
            {/* Metric 1 */}
            <div className="w-[234px] rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-black-400">Total Students</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-black/90">0</h4>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="w-[234px] rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <AlertIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-black-400">Unpaid Students</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-black/90">0</h4>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="w-[234px] rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <AlertIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-black-400">Unpaid Payments</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-black/90">0</h4>
              </div>
            </div>
          </div>

{/* Upcoming Payments */}
<div className="w-full sm:w-[420px] md:w-[480px] lg:w-[760px] shrink-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
  <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-black">Upcoming Payments</h3>
  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 max-h-[300px] overflow-y-auto">
  {/* Payment item 1 */}
<div className="relative flex justify-between items-center border-b border-gray-100 pb-2">
  <div>
    <span className="font-medium">amina elmahi</span>
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Registration - $500</span>
    </div>
  </div>

  <div>
    <div className="mt-2 flex flex-col items-end">
      <span className="text-xs text-gray-500">
        {` ${getTimeRemaining('2025-05-01')}`}
      </span>
      <div className="text-xs text-gray-500 mt-1">
        Due: May 1, 2025
      </div>
    </div>
  </div>
</div>

 {/* Payment item 1 */}
<div className="relative flex justify-between items-center border-b border-gray-100 pb-2">
  <div>
    <span className="font-medium">adam moutik</span>
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Registration - $500</span>
    </div>
  </div>

  <div>
    <div className="mt-2 flex flex-col items-end">
      <span className="text-xs text-gray-500">
        {` ${getTimeRemaining('2025-05-01')}`}
      </span>
      <div className="text-xs text-gray-500 mt-1">
        Due: May 1, 2025
      </div>
    </div>
  </div>
</div>


   {/* Payment item 1 */}
  {/* Payment item 1 */}
<div className="relative flex justify-between items-center border-b border-gray-100 pb-2">
  <div>
    <span className="font-medium">malak nihan</span>
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Registration - $500</span>
    </div>
  </div>

  <div>
    <div className="mt-2 flex flex-col items-end">
      <span className="text-xs text-gray-500">
        {` ${getTimeRemaining('2025-04-01')}`}
      </span>
      <div className="text-xs text-gray-500 mt-1">
        Due: May 1, 2025
      </div>
    </div>
  </div>
</div>
  {/* Payment item 1 */}
  <div className="relative flex justify-between items-center border-b border-gray-100 pb-2">
  <div>
    <span className="font-medium">malak nihan</span>
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Registration - $500</span>
    </div>
  </div>

  <div>
    <div className="mt-2 flex flex-col items-end">
      <span className="text-xs text-gray-500">
        {` ${getTimeRemaining('2025-04-01')}`}
      </span>
      <div className="text-xs text-gray-500 mt-1">
        Due: May 1, 2025
      </div>
    </div>
  </div>
</div>
  {/* Payment item 1 */}
  <div className="relative flex justify-between items-center border-b border-gray-100 pb-2">
  <div>
    <span className="font-medium">malak nihan</span>
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Registration - $500</span>
    </div>
  </div>

  <div>
    <div className="mt-2 flex flex-col items-end">
      <span className="text-xs text-gray-500">
        {` ${getTimeRemaining('2025-04-01')}`}
      </span>
      <div className="text-xs text-gray-500 mt-1">
        Due: May 1, 2025
      </div>
    </div>
  </div>
</div>
  {/* Payment item 1 */}
  <div className="relative flex justify-between items-center border-b border-gray-100 pb-2">
  <div>
    <span className="font-medium">malak nihan</span>
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Registration - $500</span>
    </div>
  </div>

  <div>
    <div className="mt-2 flex flex-col items-end">
      <span className="text-xs text-gray-500">
        {` ${getTimeRemaining('2025-04-01')}`}
      </span>
      <div className="text-xs text-gray-500 mt-1">
        Due: May 1, 2025
      </div>
    </div>
  </div>
</div>
  {/* Payment item 1 */}
  <div className="relative flex justify-between items-center border-b border-gray-100 pb-2">
  <div>
    <span className="font-medium">malak nihan</span>
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Registration - $500</span>
    </div>
  </div>

  <div>
    <div className="mt-2 flex flex-col items-end">
      <span className="text-xs text-gray-500">
        {` ${getTimeRemaining('2025-04-01')}`}
      </span>
      <div className="text-xs text-gray-500 mt-1">
        Due: May 1, 2025
      </div>
    </div>
  </div>
</div>

  </div>
</div>

 

 

      </div>
{/* Right Column - Activity Feed */}
<div className="w-[360px] shrink-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
  <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-black">Activity Feed</h3>
  <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 max-h-[500px] overflow-y-auto">
    
    <li className="border-b border-gray-100 pb-2">
      <div className="flex justify-between items-center">
        <strong className="font-medium">New student registered</strong>
        <span className="text-xs text-gray-500">Less than a minute ago</span>
      </div>
      <span className="text-sm">Student: Adam Adam</span>
    </li>
    <li className="border-b border-gray-100 pb-2">
      <div className="flex justify-between items-center">
        <strong className="font-medium">New student registered</strong>
        <span className="text-xs text-gray-500">Less than a minute ago</span>
      </div>
      <span className="text-sm">Student: Adam Adam</span>
    </li>
    <li className="border-b border-gray-100 pb-2">
      <div className="flex justify-between items-center">
        <strong className="font-medium">New student registered</strong>
        <span className="text-xs text-gray-500">Less than a minute ago</span>
      </div>
      <span className="text-sm ">Student: Adam Adam</span>
    </li>
    <li className="border-b border-gray-100 pb-2">
      <div className="flex justify-between items-center">
        <strong className="font-medium">New student registered</strong>
        <span className="text-xs text-gray-500">Less than a minute ago</span>
      </div>
      <span className="text-sm">Student: Adam Adam</span>
    </li>

    <li className="border-b border-gray-100 pb-2">
      <div className="flex justify-between items-center">
        <strong className="font-medium">Payment received</strong>
        <span className="text-xs text-gray-500">1 day ago</span>
      </div>
      <span className="text-sm">Student: Amina XXX</span><br />
      <span className="text-sm">Amount: $500</span>
    </li>

    <li className="border-b border-gray-100 pb-2">
      <div className="flex justify-between items-center">
        <strong className="font-medium">Family information updated</strong>
        <span className="text-xs text-gray-500">1 day ago</span>
      </div>
      <span className="text-sm">Family: Achabi Family</span>
    </li>

    <li className="border-b border-gray-100 pb-2">
      <div className="flex justify-between items-center">
        <strong className="font-medium">Transport fee marked as paid</strong>
        <span className="text-xs text-gray-500">2 days ago</span>
      </div>
      <span className="text-sm">Student: Salma Zaid</span>
    </li>

    <li className="border-b border-gray-100 pb-2">
      <div className="flex justify-between items-center">
        <strong className="font-medium">Monthly fee reminder sent</strong>
        <span className="text-xs text-gray-500">3 days ago</span>
      </div>
      <span className="text-sm">To: All parents</span>
    </li>

    <li className="border-b border-gray-100 pb-2">
      <div className="flex justify-between items-center">
        <strong className="font-medium">Assistant account created</strong>
        <span className="text-xs text-gray-500">4 days ago</span>
      </div>
      <span className="text-sm">User: assistant@alalssone.com</span>
    </li>

    <li>
      <div className="flex justify-between items-center">
        <strong className="font-medium">Insurance payment added</strong>
        <span className="text-xs text-gray-500">5 days ago</span>
      </div>
      <span className="text-sm">Student: Youssef N.</span><br />
      <span className="text-sm">Amount: $50</span>
    </li>

  </ul>
</div>


    </div>
    </div>
  );
}
