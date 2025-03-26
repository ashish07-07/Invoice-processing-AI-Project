import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
module.exports = {
  serverExternalPackages: ['canvas', 'pdfjs-dist']
}


// module.exports = {
//   webpack: (config:any) => {
//     config.resolve.fallback = {
//       fs: false,
//       path: false,
//       canvas: false,
//       worker_threads: false
//     };
//     return config;


//   },
//   experimental: {
//     serverComponentsExternalPackages: ["canvas", "pdfjs-dist"]
//   }
// };

// next.config.ts
// import type { NextConfig } from 'next';
// import path from 'path';

// const config: NextConfig = {
//   webpack(config) {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       canvas: path.resolve(__dirname, 'empty-module.ts'), // Alias for canvas
//     };
//     return config;
//   },
// };

// export default config;



// next.config.ts
// import path from 'path';
// import type { NextConfig } from 'next';

// const config: NextConfig = {
//   webpack(config) {
//     // Resolve the pdfjs worker alias
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       'pdfjs-dist/build/pdf.worker.js': path.resolve(
//         __dirname,
//         'node_modules/pdfjs-dist/build/pdf.worker.min.js'
//       ),
//     };
//     return config;
//   },
// };

// export default config;


// // next.config.ts
// import path from 'path';
// import type { NextConfig } from 'next';

// const config: NextConfig = {
//   webpack(config) {
//     // Disable canvas module by setting its alias to false
//     config.resolve.alias['canvas'] = false;

//     return config;
//   },
// };

// export default config;

/** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config:any) => {
//       config.resolve.fallback = { 
//           ...config.resolve.fallback,
//           canvas: false 
//       };
//       return config;
//   },
// };

// module.exports = nextConfig;