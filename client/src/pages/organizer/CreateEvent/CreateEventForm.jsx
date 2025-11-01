import OrganizerNavbar from "../../../sharedCompents/Organizer/OrganizerNavbar";
import OrganizerSidebar from "../../../sharedCompents/Organizer/OrganizerSidebar";

const CreateEventForm = () => {
  return (
    <div>
        <h2>Create Events</h2>
    </div>
  );
};

export default CreateEventForm;


// import React from 'react';
// import { ChevronRight, ChevronLeft, Check, MapPin, Upload, X, Plus, Trash2, Edit3 } from 'lucide-react';

// // Header Component
// const Header = () => {
//   return (
//     <div className="bg-[#F4C790] border-b border-orange-200 px-8 py-4 flex justify-between items-center">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
//           <span className="text-white font-bold text-xl">📚</span>
//         </div>
//         <span className="text-2xl font-bold">BOOKENT</span>
//       </div>
//       <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
//         <span className="text-white">👤</span>
//       </div>
//     </div>
//   );
// };

// // Progress Steps Component
// const ProgressSteps = ({ currentStep = 1 }) => {
//   const steps = [
//     { number: 1, title: 'Basic Info' },
//     { number: 2, title: 'Venue & Map' },
//     { number: 3, title: 'Match Time' },
//     { number: 4, title: 'Ticket Setup' },
//     { number: 5, title: 'Upload Media' },
//     { number: 6, title: 'Publish / Preview' }
//   ];

//   return (
//     <div className="bg-white border-b border-gray-200 px-8 py-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center justify-between">
//           {steps.map((step, index) => (
//             <React.Fragment key={step.number}>
//               <div className="flex flex-col items-center">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
//                   currentStep > step.number 
//                     ? 'bg-green-500 text-white' 
//                     : currentStep === step.number 
//                     ? 'bg-purple-600 text-white' 
//                     : 'bg-gray-200 text-gray-400'
//                 }`}>
//                   {currentStep > step.number ? <Check size={20} /> : step.number}
//                 </div>
//                 <span className={`text-xs mt-2 font-medium ${
//                   currentStep === step.number ? 'text-purple-600' : 'text-gray-500'
//                 }`}>
//                   {step.title}
//                 </span>
//               </div>
//               {index < steps.length - 1 && (
//                 <div className={`flex-1 h-1 mx-2 mb-6 rounded ${
//                   currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
//                 }`} />
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 1: Basic Info Component
// const BasicInfoStep = () => {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
      
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
//         <input
//           type="text"
//           placeholder="e.g., India vs Pakistan – T20 Match"
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Sport Type *</label>
//         <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
//           <option value="">Select sport type</option>
//           <option>Cricket</option>
//           <option>Football</option>
//           <option>Kabaddi</option>
//           <option>Basketball</option>
//           <option>Volleyball</option>
//           <option>Hockey</option>
//           <option>Badminton</option>
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//         <textarea
//           placeholder="Enter event description, highlights, etc."
//           rows="4"
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
//         <input
//           type="text"
//           placeholder='Type and press Enter (e.g., "T20", "Kochi", "World Cup")'
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//         <div className="flex flex-wrap gap-2 mt-2">
//           <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
//             T20
//             <X size={14} className="cursor-pointer hover:text-purple-900" />
//           </span>
//           <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
//             Kochi
//             <X size={14} className="cursor-pointer hover:text-purple-900" />
//           </span>
//         </div>
//       </div>

//       <div className="border-t pt-6">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Organizer Details</h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Name</label>
//             <input
//               type="text"
//               value="John Doe"
//               readOnly
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Email</label>
//             <input
//               type="email"
//               value="john.doe@example.com"
//               readOnly
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 2: Venue & Map Component
// const VenueMapStep = () => {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Venue & Map Details</h2>
      
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Stadium Name *</label>
//         <input
//           type="text"
//           placeholder="e.g., Jawaharlal Nehru Stadium"
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
//         <textarea
//           placeholder="Full address of the venue"
//           rows="3"
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
//           <input
//             type="text"
//             placeholder="e.g., Kochi"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
//           <input
//             type="text"
//             placeholder="Auto-filled"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
//           <input
//             type="text"
//             placeholder="Optional"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//           />
//         </div>
//       </div>

//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
//           <MapPin size={18} />
//           Stadium Location Coordinates
//         </h3>
//         <p className="text-sm text-blue-700 mb-3">
//           Click the button to use your current location as the stadium coordinates. This will be used for maps and directions.
//         </p>
//         <div className="bg-white rounded p-3 mb-3">
//           <div className="text-sm">
//             <div className="flex justify-between mb-1">
//               <span className="text-gray-600">Latitude:</span>
//               <span className="font-mono font-semibold text-green-600">9.9312</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Longitude:</span>
//               <span className="font-mono font-semibold text-green-600">76.2673</span>
//             </div>
//           </div>
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//           <MapPin size={18} />
//           Use My Location as Stadium Location
//         </button>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Stadium Layout Image</label>
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
//           <Upload className="mx-auto text-gray-400 mb-2" size={32} />
//           <p className="text-gray-600 mb-2">Upload stadium seating layout</p>
//           <label className="cursor-pointer inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
//             Choose File
//           </label>
//         </div>
//       </div>

//       <div className="border-t pt-4">
//         <div className="flex items-center justify-between mb-3">
//           <div>
//             <h3 className="text-sm font-medium text-gray-700">Custom Seat Layout (Optional)</h3>
//             <p className="text-xs text-gray-500 mt-1">Create interactive stadium seating with clickable seats</p>
//           </div>
//           <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors">
//             <Edit3 size={18} />
//             Create Layout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 3: Match Time Component
// const MatchTimeStep = () => {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Match Time Details</h2>
      
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Match Date & Time *</label>
//         <input
//           type="datetime-local"
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Gate Open Time</label>
//           <input
//             type="time"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
//           <input
//             type="number"
//             placeholder="e.g., 180"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 4: Ticket Setup Component
// const TicketSetupStep = () => {
//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Ticket Setup</h2>
//         <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
//           <Plus size={18} />
//           Add Category
//         </button>
//       </div>

//       <div className="space-y-4">
//         <div className="border border-gray-200 rounded-lg p-4 relative">
//           <button className="absolute top-2 right-2 text-red-600 hover:text-red-700">
//             <Trash2 size={18} />
//           </button>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
//               <input
//                 type="text"
//                 placeholder="e.g., West Block"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
//               <input
//                 type="number"
//                 placeholder="250"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Seat Count</label>
//               <input
//                 type="number"
//                 placeholder="100"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Seat Range</label>
//               <input
//                 type="text"
//                 placeholder="1-100"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-4 pt-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Max Tickets per User</label>
//           <input
//             type="number"
//             defaultValue="5"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
//           <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
//             <option value="INR">INR (₹)</option>
//             <option value="USD">USD ($)</option>
//             <option value="EUR">EUR (€)</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Total Seats</label>
//           <input
//             type="text"
//             value="0"
//             readOnly
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed font-semibold"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 5: Upload Media Component
// const UploadMediaStep = () => {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Media</h2>
      
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image *</label>
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
//           <Upload className="mx-auto text-gray-400 mb-2" size={32} />
//           <p className="text-gray-600 mb-2">Hero image for event page</p>
//           <label className="cursor-pointer inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
//             Choose File
//           </label>
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image *</label>
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
//           <Upload className="mx-auto text-gray-400 mb-2" size={32} />
//           <p className="text-gray-600 mb-2">For listing cards</p>
//           <label className="cursor-pointer inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
//             Choose File
//           </label>
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Optional)</label>
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
//           <Upload className="mx-auto text-gray-400 mb-2" size={32} />
//           <p className="text-gray-600 mb-2">Stadium, teams, atmosphere, etc.</p>
//           <label className="cursor-pointer inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
//             Choose Files
//           </label>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 6: Publish Component
// const PublishStep = () => {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Publish / Preview</h2>
      
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Age Restriction</label>
//         <input
//           type="text"
//           placeholder="e.g., 12+ allowed"
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy</label>
//         <textarea
//           placeholder="e.g., No refund after booking"
//           rows="3"
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
//         <textarea
//           placeholder="Enter terms and conditions"
//           rows="4"
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4 pt-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//           <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
//             <option value="Draft">Draft</option>
//             <option value="Published">Published</option>
//           </select>
//         </div>
//         <div className="flex items-end">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
//             />
//             <span className="text-sm font-medium text-gray-700">Feature on home page</span>
//           </label>
//         </div>
//       </div>

//       <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-6">
//         <h3 className="font-semibold text-purple-900 mb-3">Event Summary</h3>
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div>
//             <span className="text-gray-600">Event:</span>
//             <span className="ml-2 font-medium">Not set</span>
//           </div>
//           <div>
//             <span className="text-gray-600">Sport:</span>
//             <span className="ml-2 font-medium">Not set</span>
//           </div>
//           <div>
//             <span className="text-gray-600">Venue:</span>
//             <span className="ml-2 font-medium">Not set</span>
//           </div>
//           <div>
//             <span className="text-gray-600">Total Seats:</span>
//             <span className="ml-2 font-medium">0</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Navigation Buttons Component
// const NavigationButtons = ({ currentStep = 1, totalSteps = 6 }) => {
//   return (
//     <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//       <button
//         disabled={currentStep === 1}
//         className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
//           currentStep === 1
//             ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//         }`}
//       >
//         <ChevronLeft size={18} />
//         Previous
//       </button>
      
//       {currentStep < totalSteps ? (
//         <button className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
//           Next
//           <ChevronRight size={18} />
//         </button>
//       ) : (
//         <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
//           Publish Event
//         </button>
//       )}
//     </div>
//   );
// };

// // Main Component - Shows Step 1 by default
// const BookentEventForm = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
//       <Header />
//       <ProgressSteps currentStep={1} />
      
//       <div className="max-w-4xl mx-auto p-8">
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           <BasicInfoStep />
//           {/* To show other steps, replace BasicInfoStep with:
//               - VenueMapStep for step 2
//               - MatchTimeStep for step 3
//               - TicketSetupStep for step 4
//               - UploadMediaStep for step 5
//               - PublishStep for step 6
//           */}
//           <NavigationButtons currentStep={1} totalSteps={6} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookentEventForm;