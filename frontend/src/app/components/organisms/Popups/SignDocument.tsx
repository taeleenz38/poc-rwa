import React from 'react'

const SignDocument = () => {
  return (
    <div>SignDocument</div>
  )
}

export default SignDocument

// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const requestData = {
//       firstName,
//       lastName,
//       email,
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:3001/contract-sign/send",
//         requestData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("Sign request sent successfully:", response.data);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error(
//           "Error sending sign request:",
//           error.response?.data || error.message
//         );
//       } else {
//         console.error("Unexpected error:", error);
//       }
//     }
//   };