
import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  jwtClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
        },
        businessName: {
          type: "string",
          required: false,
        },
        isBlocked: {
          type: "boolean",
          required: false,
          input: false,
        },
        subscriptionPlan: {
          type: "string",
          required: false,
          input: false,
        },
        subscriptionExpiresAt: {
          type: "date",
          required: false,
          input: false,
        },
      },
    }),
    jwtClient(),
  ],
});





// import { createAuthClient } from "better-auth/react";
// import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,

//   plugins: [
//     inferAdditionalFields({
//       user: {
//         role: {
//           type: "string",
//           required: false,
//         },
//         businessName: {
//           type: "string",
//           required: false,
//         },
//         isBlocked: {
//           type: "boolean",
//           required: false,
//           input: false,
//         },
//         subscriptionPlan: {
//           type: "string",
//           required: false,
//           input: false,
//         },
//         subscriptionExpiresAt: {
//           type: "date",
//           required: false,
//           input: false,
//         },
//       },
//     }),
//     jwtClient(),
//   ],
// });
