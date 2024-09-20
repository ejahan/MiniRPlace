// import { Response } from 'fets';
// import { router } from '../lib/server.js';
// import { canvas } from '../lib/canvas.js';

// const CANVAS_PATH = '/canvas';

// router.route({
//   path: CANVAS_PATH,
//   method: 'GET',
//   schemas: {
//     responses: {
//       200: {
//         type: 'array',
//         items: {
//           type: 'array',
//           items: {
//             type: 'string'
//           }
//         }
//       } as const
//     }
//   },
//   handler() {

//     return Response.json(canvas);
//   }
// });



// const CANVAS_UPDATE = '/update_canvas';

// // Variable pour stocker les éléments (par exemple, en mémoire)
// let items: string[] = [];

// router.route({
//   path: CANVAS_UPDATE,
//   method: 'POST',
//   schemas: {
//     request: {
//       body: {
//         type: 'object',
//         properties: {
//           item: {
//             type: 'string'
//           }
//         },
//         required: ['item']
//       } as const
//     },
//     responses: {
//       201: {
//         type: 'object',
//         properties: {
//           success: { type: 'boolean' },
//           item: { type: 'string' }
//         }
//       } as const
//     }
//   },
//   handler(req) {
//     const { item } = req.body;
//     console.log(item);
//     items.push(item);
//     return Response.json({ success: true, item }, 201);
//   }
// });
